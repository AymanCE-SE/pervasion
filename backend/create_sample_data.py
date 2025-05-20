import os
import django
import tempfile
from django.core.files import File

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pervasion.settings')
django.setup()

# Import models after Django setup
from users.models import User
from projects.models import Category, Project
from contact.models import Contact

def create_categories():
    print("Creating categories...")
    categories = [
        {"name": "Web Development", "name_ar": "تطوير الويب"},
        {"name": "Mobile Development", "name_ar": "تطوير تطبيقات الجوال"},
        {"name": "UI/UX Design", "name_ar": "تصميم واجهة المستخدم"},
        {"name": "Backend Development", "name_ar": "تطوير الخلفية"},
    ]
    
    created_categories = []
    for category_data in categories:
        category, created = Category.objects.get_or_create(
            name=category_data["name"],
            defaults={"name_ar": category_data["name_ar"]}
        )
        created_categories.append(category)
        print(f"  {'Created' if created else 'Found'} category: {category.name}")
    
    return created_categories

def create_projects(categories):
    print("\nCreating projects...")
    projects = [
        {
            "title": "E-commerce Platform",
            "title_ar": "منصة التجارة الإلكترونية",
            "description": "A full-featured e-commerce platform with product management, cart, and checkout.",
            "description_ar": "منصة تجارة إلكترونية كاملة المميزات مع إدارة المنتجات والسلة والدفع.",
            "category": categories[0],  # Web Development
            "client": "ABC Company",
            "date": "2023-01-15",
            "featured": True,
        },
        {
            "title": "Task Management App",
            "title_ar": "تطبيق إدارة المهام",
            "description": "A mobile application for managing tasks and projects.",
            "description_ar": "تطبيق جوال لإدارة المهام والمشاريع.",
            "category": categories[1],  # Mobile Development
            "client": "XYZ Corporation",
            "date": "2023-03-20",
            "featured": False,
        },
        {
            "title": "Portfolio Website",
            "title_ar": "موقع المحفظة الشخصية",
            "description": "A personal portfolio website showcasing projects and skills.",
            "description_ar": "موقع محفظة شخصية يعرض المشاريع والمهارات.",
            "category": categories[2],  # UI/UX Design
            "client": "John Doe",
            "date": "2023-05-10",
            "featured": True,
        },
        {
            "title": "API Service",
            "title_ar": "خدمة واجهة برمجة التطبيقات",
            "description": "A RESTful API service for data processing and analysis.",
            "description_ar": "خدمة واجهة برمجة تطبيقات RESTful لمعالجة البيانات وتحليلها.",
            "category": categories[3],  # Backend Development
            "client": "Data Analytics Inc",
            "date": "2023-07-05",
            "featured": False,
        },
    ]
    
    created_projects = []
    for project_data in projects:
        # Create a temporary blank image file for the project
        with tempfile.NamedTemporaryFile(suffix='.jpg') as temp_img:
            # Write a minimal valid JPEG file
            temp_img.write(b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x03\x02\x02\x02\x02\x02\x03\x02\x02\x02\x03\x03\x03\x03\x04\x06\x04\x04\x04\x04\x04\x08\x06\x06\x05\x06\t\x08\n\n\t\x08\t\t\n\x0c\x0f\x0c\n\x0b\x0e\x0b\t\t\r\x11\r\x0e\x0f\x10\x10\x11\x10\n\x0c\x12\x13\x12\x10\x13\x0f\x10\x10\x10\xff\xc9\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xcc\x00\x06\x00\x10\x10\x05\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xd2\xcf\x20\xff\xd9')
            temp_img.flush()
            
            project, created = Project.objects.get_or_create(
                title=project_data["title"],
                defaults={
                    "title_ar": project_data["title_ar"],
                    "description": project_data["description"],
                    "description_ar": project_data["description_ar"],
                    "category": project_data["category"],
                    "client": project_data["client"],
                    "date": project_data["date"],
                    "featured": project_data["featured"],
                    "image": File(temp_img, name=f"{project_data['title'].lower().replace(' ', '_')}.jpg"),
                }
            )
        created_projects.append(project)
        print(f"  {'Created' if created else 'Found'} project: {project.title}")
    
    return created_projects

def create_contacts():
    print("\nCreating sample contact submissions...")
    contacts = [
        {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Project Inquiry",
            "message": "I'm interested in discussing a potential web development project for my company.",
        },
        {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "subject": "Collaboration Opportunity",
            "message": "I'd like to discuss a potential collaboration on a mobile app project.",
        },
    ]
    
    created_contacts = []
    for contact_data in contacts:
        contact, created = Contact.objects.get_or_create(
            email=contact_data["email"],
            subject=contact_data["subject"],
            defaults={
                "name": contact_data["name"],
                "message": contact_data["message"],
            }
        )
        created_contacts.append(contact)
        print(f"  {'Created' if created else 'Found'} contact: {contact.subject} from {contact.name}")
    
    return created_contacts

def main():
    print("Creating sample data for the Pervasion portfolio project...\n")
    
    # Create sample data
    categories = create_categories()
    projects = create_projects(categories)
    contacts = create_contacts()
    
    print("\nSample data creation completed!")
    print(f"Created {len(categories)} categories, {len(projects)} projects, and {len(contacts)} contacts.")

if __name__ == "__main__":
    main()
