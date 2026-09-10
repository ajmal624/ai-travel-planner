from django.contrib import admin

from .models import ItineraryItem, Trip

admin.site.register(Trip)
admin.site.register(ItineraryItem)