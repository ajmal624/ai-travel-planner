from django.contrib.auth.models import User
from rest_framework import serializers

from .models import ItineraryItem, Trip


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6,
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
        ]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )


class TripSerializer(serializers.ModelSerializer):
    total_estimated_cost = serializers.SerializerMethodField()
    trip_days = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = [
            "id",
            "title",
            "city",
            "country",
            "start_date",
            "end_date",
            "budget",
            "pace",
            "interests",
            "travelers",
            "estimated_budget",
            "total_estimated_cost",
            "trip_days",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "estimated_budget",
            "total_estimated_cost",
            "trip_days",
            "created_at",
        ]

    def validate(self, attrs):
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        if (
            start_date
            and end_date
            and end_date < start_date
        ):
            raise serializers.ValidationError(
                {
                    "end_date": (
                        "End date must be on or after "
                        "start date."
                    )
                }
            )

        interests = attrs.get("interests")

        if isinstance(interests, list):
            cleaned_interests = [
                str(interest).strip()
                for interest in interests
                if str(interest).strip()
            ]

            attrs["interests"] = ",".join(
                cleaned_interests
            )

        return attrs

    def get_total_estimated_cost(self, obj):
        return sum(
            item.estimated_cost
            for item in obj.itinerary_items.all()
        )

    def get_trip_days(self, obj):
        return (
            (obj.end_date - obj.start_date).days
            + 1
        )


class ItineraryItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItineraryItem
        fields = [
            "id",
            "trip",
            "date",
            "time_slot",
            "title",
            "description",
            "category",
            "estimated_cost",
            "completed",
            "generated_by_ai",
        ]

        read_only_fields = [
            "generated_by_ai",
        ]

    def validate_trip(self, trip):
        request = self.context.get("request")

        if request and trip.user != request.user:
            raise serializers.ValidationError(
                "You can only use your own trips."
            )

        return trip