import json
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from projects.models import Category, Project
from contact.models import Contact

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialize database with sample data from the old JSON Server'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting database initialization...'))
        
        # Check if we already have data
        if User.objects.exists():
            self.stdout.write(self.style.WARNING('Database already contains data. Skipping initialization.'))
            return
        
        # Try to find the old db.json file
        json_file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '..', 'server', 'db.json')
        
        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.WARNING(f'Could not find db.json at {json_file_path}. Creating default data instead.'))
            self._create_default_data()
            return
        
        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Create users
            self.stdout.write('Creating users...')
            for user_data in data.get('users', []):
                try:
                    # Skip if user doesn't have required fields
                    if not all(k in user_data for k in ['username', 'email', 'password']):
                        continue
                        
                    User.objects.create_user(
                        email=user_data['email'],
                        username=user_data['username'],
                        password=user_data['password'],
                        name=user_data.get('name', ''),
                        role=user_data.get('role', 'user')
                    )
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error creating user {user_data.get("username")}: {str(e)}'))
            
            # Create categories
            self.stdout.write('Creating categories...')
            category_map = {}  # To map old IDs to new objects
            for cat_data in data.get('categories', []):
                try:
                    category = Category.objects.create(
                        name=cat_data.get('name', ''),
                        name_ar=cat_data.get('nameAr', '')
                    )
                    category_map[cat_data.get('id')] = category
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error creating category {cat_data.get("name")}: {str(e)}'))
            
            # Create projects
            self.stdout.write('Creating projects...')
            for project_data in data.get('projects', []):
                try:
                    # Get category or use the first one
                    category_id = project_data.get('category')
                    category = category_map.get(category_id)
                    
                    if not category and Category.objects.exists():
                        category = Category.objects.first()
                    elif not category:
                        # Create a default category if none exists
                        category = Category.objects.create(name='Default', name_ar='افتراضي')
                    
                    # Create project
                    Project.objects.create(
                        title=project_data.get('title', ''),
                        title_ar=project_data.get('titleAr', ''),
                        description=project_data.get('description', ''),
                        description_ar=project_data.get('descriptionAr', ''),
                        category=category,
                        image=project_data.get('image', ''),  # This will be a URL, not a file
                        client=project_data.get('client', ''),
                        date=project_data.get('date', '2025-01-01'),
                        featured=project_data.get('featured', False)
                    )
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error creating project {project_data.get("title")}: {str(e)}'))
            
            # Create contacts
            self.stdout.write('Creating contacts...')
            for contact_data in data.get('contact', []):
                try:
                    Contact.objects.create(
                        name=contact_data.get('name', ''),
                        email=contact_data.get('email', ''),
                        subject=contact_data.get('subject', ''),
                        message=contact_data.get('message', ''),
                        is_read=contact_data.get('is_read', False)
                    )
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error creating contact from {contact_data.get("name")}: {str(e)}'))
            
            self.stdout.write(self.style.SUCCESS('Database initialization completed successfully!'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error initializing database: {str(e)}'))
            self._create_default_data()
    
    def _create_default_data(self):
        """Create default data if JSON import fails"""
        self.stdout.write('Creating default data...')
        
        # Create admin user
        self.stdout.write('Creating admin user...')
        User.objects.create_superuser(
            email='admin@example.com',
            username='admin',
            password='admin123',
            name='Admin User'
        )
        
        # Create categories
        self.stdout.write('Creating default categories...')
        categories = [
            {'name': 'branding', 'name_ar': 'تصميم الهوية'},
            {'name': 'ui-design', 'name_ar': 'تصميم واجهة المستخدم'},
            {'name': 'social-media', 'name_ar': 'وسائل التواصل الاجتماعي'},
            {'name': 'packaging', 'name_ar': 'تصميم العبوات'},
            {'name': 'print', 'name_ar': 'تصميم مطبوع'},
            {'name': 'motion', 'name_ar': 'رسومات متحركة'}
        ]
        
        for cat_data in categories:
            Category.objects.create(**cat_data)
        
        self.stdout.write(self.style.SUCCESS('Default data created successfully!'))
