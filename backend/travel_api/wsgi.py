<<<<<<< HEAD
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "travel_api.settings")

=======
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "travel_api.settings")

>>>>>>> 044613901e135b56f5d40479de9d89927dc76f0a
application = get_wsgi_application()