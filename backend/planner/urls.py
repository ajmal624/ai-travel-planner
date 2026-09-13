from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

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
    path("auth/register/", RegisterView.as_view(), name="register"),
    path(
        "auth/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("", include(router.urls)),
]