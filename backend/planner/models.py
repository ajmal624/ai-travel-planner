from django.contrib.auth.models import User
from django.db import models


class Trip(models.Model):
    PACE_CHOICES = [
        ("slow", "Slow and relaxed"),
        ("balanced", "Balanced"),
        ("fast", "Fast-paced"),
    ]

    BUDGET_CHOICES = [
        ("low", "Budget"),
        ("medium", "Moderate"),
        ("high", "Luxury"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="trips",
    )
    title = models.CharField(max_length=150)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.CharField(max_length=10, choices=BUDGET_CHOICES)
    pace = models.CharField(max_length=10, choices=PACE_CHOICES)
    interests = models.CharField(
        max_length=255,
        help_text="Comma-separated interests",
    )
    travelers = models.PositiveIntegerField(default=1)
    estimated_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return self.title


class ItineraryItem(models.Model):
    TIME_CHOICES = [
        ("morning", "Morning"),
        ("afternoon", "Afternoon"),
        ("evening", "Evening"),
    ]

    trip = models.ForeignKey(
        Trip,
        on_delete=models.CASCADE,
        related_name="itinerary_items",
    )
    date = models.DateField()
    time_slot = models.CharField(max_length=10, choices=TIME_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, default="Sightseeing")
    estimated_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    completed = models.BooleanField(default=False)
    generated_by_ai = models.BooleanField(default=True)

    class Meta:
        ordering = ["date", "time_slot"]

    def __str__(self):
        return self.title