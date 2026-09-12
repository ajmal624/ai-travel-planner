<<<<<<< HEAD
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DashboardViewSet,
    ItineraryItemViewSet,
    RegisterView,
    TripViewSet,
)

router = DefaultRouter()

router.register("trips", TripViewSet, basename="trip")
router.register("itinerary", ItineraryItemViewSet, basename="itinerary")
router.register("dashboard", DashboardViewSet, basename="dashboard")

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("", include(router.urls)),
=======
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DashboardViewSet,
    ItineraryItemViewSet,
    RegisterView,
    TripViewSet,
)

router = DefaultRouter()

router.register("trips", TripViewSet, basename="trip")
router.register("itinerary", ItineraryItemViewSet, basename="itinerary")
router.register("dashboard", DashboardViewSet, basename="dashboard")

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("", include(router.urls)),
>>>>>>> 044613901e135b56f5d40479de9d89927dc76f0a
]