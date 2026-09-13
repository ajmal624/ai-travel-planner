from django.contrib.auth.models import User
from rest_framework import serializers

from .models import ItineraryItem, Trip


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

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

    def get_total_estimated_cost(self, obj):
        total = sum(
            item.estimated_cost for item in obj.itinerary_items.all()
        )
        return total

    def get_trip_days(self, obj):
        return (obj.end_date - obj.start_date).days + 1

    def validate(self, data):
        if data["end_date"] < data["start_date"]:
            raise serializers.ValidationError(
                "End date must be later than or equal to start date."
            )
        return data


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
        read_only_fields = ["id", "generated_by_ai"]

    def validate_trip(self, trip):
        if trip.user != self.context["request"].user:
            raise serializers.ValidationError("Invalid trip.")
        return trip