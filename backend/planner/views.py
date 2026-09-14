from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import ItineraryItem, Trip
from .serializers import (
    ItineraryItemSerializer,
    RegisterSerializer,
    TripSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer

    def get_queryset(self):
        return (
            Trip.objects.filter(user=self.request.user)
            .prefetch_related("itinerary_items")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(
        detail=True,
        methods=["post"],
        url_path="generate-itinerary",
    )
    def generate_itinerary(self, request, pk=None):
        trip = self.get_object()

        # Remove previously AI-generated itinerary items
        trip.itinerary_items.filter(
            generated_by_ai=True
        ).delete()

        # Convert comma-separated interests into a list
        interests = [
            interest.strip().lower()
            for interest in trip.interests.split(",")
            if interest.strip()
        ]

        # Budget values must match Trip.BUDGET_CHOICES
        budget_costs = {
            "budget": Decimal("300"),
            "moderate": Decimal("900"),
            "luxary": Decimal("2500"),
        }

        pace_slots = {
            "slow": [
                "morning",
                "evening",
            ],
            "balanced": [
                "morning",
                "afternoon",
                "evening",
            ],
            "fast": [
                "morning",
                "afternoon",
                "evening",
            ],
        }

        city = trip.city

        base_cost = budget_costs.get(
            trip.budget,
            Decimal("900"),
        )

        slots = pace_slots.get(
            trip.pace,
            pace_slots["balanced"],
        )

        suggestions = {
            "food": [
                (
                    "Try local breakfast",
                    "Food",
                    "Explore a popular local breakfast place.",
                ),
                (
                    "Local food market",
                    "Food",
                    "Taste regional snacks and street food.",
                ),
                (
                    "Dinner at a local restaurant",
                    "Food",
                    "Try a signature dish from the city.",
                ),
            ],
            "history": [
                (
                    "Historic city walk",
                    "History",
                    "Visit old streets and historic landmarks.",
                ),
                (
                    "Museum visit",
                    "History",
                    "Explore local history and cultural exhibits.",
                ),
                (
                    "Heritage monument",
                    "History",
                    "Visit a well-known monument or heritage site.",
                ),
            ],
            "nature": [
                (
                    "Park or garden visit",
                    "Nature",
                    "Spend time in a scenic garden or public park.",
                ),
                (
                    "Sunset viewpoint",
                    "Nature",
                    "Watch sunset from a popular viewpoint.",
                ),
                (
                    "Outdoor walk",
                    "Nature",
                    "Enjoy a relaxed walk in a green area.",
                ),
            ],
            "shopping": [
                (
                    "Local market shopping",
                    "Shopping",
                    "Browse traditional products and souvenirs.",
                ),
                (
                    "Handicraft district",
                    "Shopping",
                    "Explore local handmade goods.",
                ),
                (
                    "Evening bazaar",
                    "Shopping",
                    "Visit a busy evening market.",
                ),
            ],
            "adventure": [
                (
                    "Outdoor activity",
                    "Adventure",
                    "Choose a local activity such as cycling or trekking.",
                ),
                (
                    "Adventure experience",
                    "Adventure",
                    "Book a city-specific adventure activity.",
                ),
                (
                    "Explore hidden areas",
                    "Adventure",
                    "Take a guided walk beyond tourist locations.",
                ),
            ],
            "art": [
                (
                    "Art gallery visit",
                    "Art",
                    "Explore local art, design, and creativity.",
                ),
                (
                    "Cultural performance",
                    "Art",
                    "Attend music, theatre, or dance performance.",
                ),
                (
                    "Creative neighborhood walk",
                    "Art",
                    "Explore murals, studios, and galleries.",
                ),
            ],
        }

        default_suggestions = [
            (
                "City orientation walk",
                "Sightseeing",
                "Get familiar with the main areas of the city.",
            ),
            (
                "Popular local attraction",
                "Sightseeing",
                "Visit one of the city's popular attractions.",
            ),
            (
                "Relaxed evening exploration",
                "Sightseeing",
                "Walk through a lively neighborhood.",
            ),
        ]

        selected_suggestions = []

        for interest in interests:
            if interest in suggestions:
                selected_suggestions.extend(
                    suggestions[interest]
                )

        if not selected_suggestions:
            selected_suggestions = default_suggestions

        created_items = []

        current_date = trip.start_date
        suggestion_index = 0
        total_cost = Decimal("0")

        while current_date <= trip.end_date:
            for slot_index, time_slot in enumerate(slots):
                suggestion = selected_suggestions[
                    suggestion_index % len(selected_suggestions)
                ]

                title, category, description = suggestion

                if (
                    trip.pace == "fast"
                    and slot_index == 1
                ):
                    description += (
                        " Keep travel time short to fit "
                        "more activities."
                    )

                activity_cost = base_cost

                if time_slot == "evening":
                    activity_cost = (
                        base_cost * Decimal("1.2")
                    )

                item = ItineraryItem.objects.create(
                    trip=trip,
                    date=current_date,
                    time_slot=time_slot,
                    title=f"{title} in {city}",
                    description=description,
                    category=category,
                    estimated_cost=activity_cost,
                    generated_by_ai=True,
                )

                created_items.append(item)

                total_cost += activity_cost
                suggestion_index += 1

            current_date += timedelta(days=1)

        trip.estimated_budget = (
            total_cost * trip.travelers
        )

        trip.save()

        return Response(
            {
                "message": (
                    "Your personalized travel itinerary "
                    "was created."
                ),
                "estimated_budget": trip.estimated_budget,
                "items": ItineraryItemSerializer(
                    created_items,
                    many=True,
                    context={"request": request},
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ItineraryItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItineraryItemSerializer

    def get_queryset(self):
        queryset = (
            ItineraryItem.objects.filter(
                trip__user=self.request.user
            )
            .select_related("trip")
        )

        trip_id = self.request.query_params.get("trip")

        if trip_id:
            queryset = queryset.filter(
                trip_id=trip_id
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(generated_by_ai=False)


class DashboardViewSet(viewsets.ViewSet):

    def list(self, request):
        trips = (
            Trip.objects.filter(user=request.user)
            .prefetch_related("itinerary_items")
        )

        total_trips = trips.count()

        total_activities = (
            ItineraryItem.objects.filter(
                trip__user=request.user
            ).count()
        )

        completed_activities = (
            ItineraryItem.objects.filter(
                trip__user=request.user,
                completed=True,
            ).count()
        )

        upcoming_trips = trips.order_by(
            "start_date"
        )[:5]

        return Response(
            {
                "total_trips": total_trips,
                "total_activities": total_activities,
                "completed_activities": completed_activities,
                "upcoming_trips": TripSerializer(
                    upcoming_trips,
                    many=True,
                    context={"request": request},
                ).data,
            }
        )