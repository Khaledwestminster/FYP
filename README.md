To set up the backend
To install the dependencies: pip install -r requirements.txt
Make Migrations (to generate migration files for any changes to your models): python manage.py makemigrations
Migrate (to apply migrations to the database): python manage.py migrate
Create a Superuser: python manage.py createsuperuser
Start the Django Development Server*: python manage.py runserver
To set up Frontend
cd frontend
npm run dev
