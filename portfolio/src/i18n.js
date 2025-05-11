import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Helper function to safely access localStorage
const getSavedLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang) return savedLang;
  
  // Fallback to browser language if no saved language
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'ar'].includes(browserLang) ? browserLang : 'en';
};

// English translations
const enTranslations = {
  app: {
    title: 'Creative Portfolio',
    description: 'A modern graphic designer portfolio showcasing creative work',
  },
  nav: {
    home: 'Home',
    projects: 'Projects',
    about: 'About',
    contact: 'Contact',
    admin: 'Admin',
    dashboard: 'Dashboard',
    services: 'Services',
  },
  home: {
    hero: {
      titleStart: 'We Create',
      title: 'Creative',
      titleHighlight: 'Design Solutions For Your Vision',
      subtitle: 'Transforming ideas into visual experiences',
      cta: 'View Projects',
      ctaSecondary: 'Contact Us',
      badge: 'Professional Design Services',
      yearsExperience: 'Years Experience',
      projectsCompleted: 'Projects Completed',
      clientSatisfaction: 'Client Satisfaction',
      card1: 'Brand Identity',
      card2: 'Creative Design',
      titleEnd: 'that tell your Story',
    },
    featuredProjects: {
      title: 'Featured Projects',
      subtitle: 'Selected works from my portfolio',
    },
  },
  projects: {
    title: 'Projects',
    subtitle: 'Explore my creative work',
    categories: {
      all: 'All',
      branding: 'Branding',
      webDesign: 'Web Design',
      illustration: 'Illustration',
      packaging: 'Packaging',
      printDesign: 'Print Design',
    },
    client: 'Client',
    date: 'Date',
    category: 'Category',
    viewProject: 'View All Projects',
    viewDetails: 'View Details',
    relatedProjects: 'Related Projects',
    noProjects: 'No projects found',
  },
  about: {
    title: 'About Me',
    subtitle: 'Learn more about my journey, skills, and experience',
    bio: {
      title: 'Creative Designer',
      content1: 'I am a passionate graphic designer with over 8 years of experience in creating visual identities, digital designs, and print materials for various clients.',
      content2: 'My approach combines creativity with strategic thinking to deliver designs that not only look great but also effectively communicate the client\'s message and achieve their business goals.',
    },
    skills: {
      title: 'My Skills',
      branding: 'Branding',
      webDesign: 'Web Design',
      illustration: 'Illustration',
      packaging: 'Packaging',
      printDesign: 'Print Design',
      uiDesign: 'UI Design',
    },
    experience: {
      title: 'Experience',
      years: 'Years of Experience',
      clients: 'Happy Clients',
      projects: 'Projects Completed',
    },
  },
  contact: {
    title: 'Get In Touch',
    subtitle: 'Have a project in mind? Let\'s work together!',
    form: {
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      submit: 'Send Message',
    },
    info: {
      title: 'Contact Information',
      address: 'Address',
      addressValue: '123 Design Street, Creative City, NY 10001',
      phone: 'Phone',
      phoneValue: '+1 (555) 123-4567',
      email: 'Email',
      emailValue: 'contact@creativeportfolio.com',
      hours: 'Working Hours',
      hoursValue: 'Monday - Friday: 9am - 6pm',
      social: 'Follow Us',
    },
    success: 'Your message has been sent successfully!',
    error: 'There was an error sending your message. Please try again.',
    validation: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
    },
  },
  admin: {
    dashboard: 'Dashboard',
    adminPanel: 'Admin Panel',
    projects: 'Projects',
    users: 'Users',
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    addNew: 'Add New',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    confirmDelete: 'Are you sure you want to delete this item?',
    projectForm: {
      title: 'Title',
      description: 'Description',
      category: 'Category',
      client: 'Client',
      date: 'Date',
      image: 'Image URL',
      images: 'Additional Images',
      featured: 'Featured Project',
    },
    userForm: {
      username: 'Username',
      password: 'Password',
      email: 'Email',
      name: 'Full Name',
      role: 'Role',
    },
    stats: {
      totalProjects: 'Total Projects',
      featuredProjects: 'Featured Projects',
      totalUsers: 'Total Users',
      recentProjects: 'Recent Projects',
    },
  },
  common: {
    loading: 'Loading...',
    retry: 'Retry',
    viewMore: 'View More',
    viewLess: 'View Less',
    readMore: 'Read More',
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    signup: 'Register',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    submit: 'Submit',
    validation: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      passwordMismatch: 'Passwords do not match',
      minLength: 'Minimum length is {{length}} characters',
    },
    welcomeBack: 'Welcome back !',
    username: 'Username',
    noAccount: 'Don\'t have an account?',
  },
  footer: {
    follow: 'Follow Us',
    subscribe: 'Subscribe to our newsletter',
    subscribeText: 'Get the latest updates and offers',
    emailPlaceholder: 'Enter your email address',
    subscribeButton: 'Subscribe',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    rights: 'All rights reserved',
  },
  testimonials: {
    title: 'What Our Clients Say',
    subtitle: 'Discover why clients love working with us and how we\'ve helped them achieve their goals',
  },
  clients: {
    title: 'Our Clients',
    subtitle: 'We are proud to work with a diverse range of clients from various industries',
    satisfied: 'Satisfied Clients',
  },
  awards: {
    title: 'Our Awards',
    subtitle: 'We have received numerous awards in recognition of our creative and innovative',
    won: 'Awards Won',
  },
  projects: {
    title: 'Our Projects',
    subtitle: 'Explore a selection of our featured projects that showcase our skills and creativity',
    completed: 'Completed Projects',
  },
  years: {
    title: 'Years of Experience',
    subtitle: 'We have extensive experience in the field of graphic design and creativity',
    experience: 'Years of Experience',
  },
};

// Arabic translations
const arTranslations = {
  app: {
    title: 'معرض إبداعي',
    description: 'معرض مصمم جرافيك حديث يعرض الأعمال الإبداعية',
  },
  nav: {
    home: 'الرئيسية',
    projects: 'المشاريع',
    about: 'من أنا',
    contact: 'اتصل بي',
    admin: 'الإدارة',
    dashboard: 'لوحة المستخدم',
    services: 'الخدمات',
  },
  home: {
    hero: {
      titleStart: 'نحن نصنع',
      title:  ' إبداعي',
      titleHighlight: 'حلول تصميم لرؤيتك',
      subtitle: 'تحويل الأفكار إلى تجارب بصرية',
      cta: 'عرض المشاريع',
      ctaSecondary: 'اتصل بنا',
      badge: 'خدمات تصميم احترافية',
      yearsExperience: 'سنوات الخبرة',
      projectsCompleted: 'مشاريع منجزة',
      clientSatisfaction: 'رضا العملاء',
      card1: 'هوية العلامة التجارية',
      card2: 'تصميم إبداعي',
      titleEnd: 'التي تحكي قصتك',
    },
    featuredProjects: {
      title: 'مشاريع مميزة',
      subtitle: 'أعمال مختارة من معرضي',
    },
  },
  projects: {
    title: 'المشاريع',
    subtitle: 'استكشف أعمالي الإبداعية',
    categories: {
      all: 'الكل',
      branding: 'هوية بصرية',
      webDesign: 'تصميم ويب',
      illustration: 'رسوم توضيحية',
      packaging: 'تغليف',
      printDesign: 'تصميم مطبوعات',
    },
    client: 'العميل',
    date: 'التاريخ',
    category: 'الفئة',
    viewProject: 'عرض جميع المشاريع',
    viewDetails: 'عرض التفاصيل',
    relatedProjects: 'مشاريع ذات صلة',
    noProjects: 'لم يتم العثور على مشاريع',
  },
  about: {
    title: 'من أنا',
    subtitle: 'تعرف أكثر على رحلتي ومهاراتي وخبرتي',
    bio: {
      title: 'مصمم إبداعي',
      content1: 'أنا مصمم جرافيك شغوف بخبرة تزيد عن 8 سنوات في إنشاء هويات بصرية وتصاميم رقمية ومواد مطبوعة لمختلف العملاء.',
      content2: 'ينهجي يجمع بين الإبداع والتفكير الاستراتيجي لتقديم تصاميم لا تبدو رائعة فحسب، بل تتواصل أيضًا بشكل فعال مع رسالة العميل وتحقق أهدافه التجارية.',
    },
    skills: {
      title: 'مهاراتي',
      branding: 'هوية بصرية',
      webDesign: 'تصميم ويب',
      illustration: 'رسوم توضيحية',
      packaging: 'تغليف',
      printDesign: 'تصميم مطبوعات',
      uiDesign: 'تصميم واجهة المستخدم',
    },
    experience: {
      title: 'الخبرة',
      years: 'سنوات الخبرة',
      clients: 'عملاء سعداء',
      projects: 'مشاريع منجزة',
    },
  },
  contact: {
    title: 'تواصل معي',
    subtitle: 'هل لديك مشروع في ذهنك؟ دعنا نعمل معًا!',
    form: {
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      message: 'الرسالة',
      submit: 'إرسال الرسالة',
    },
    info: {
      title: 'معلومات الاتصال',
      address: 'العنوان',
      addressValue: '١٢٣ شارع التصميم، المدينة الإبداعية، نيويورك ١٠٠٠١',
      phone: 'الهاتف',
      phoneValue: '+١ (٥٥٥) ١٢٣-٤٥٦٧',
      email: 'البريد الإلكتروني',
      emailValue: 'contact@creativeportfolio.com',
      hours: 'ساعات العمل',
      hoursValue: 'الاثنين - الجمعة: ٩ صباحًا - ٦ مساءً',
      social: 'تابعنا',
    },
    success: 'تم إرسال رسالتك بنجاح!',
    error: 'حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.',
    validation: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    },
  },
  admin: {
    dashboard: 'لوحة التحكم',
    adminPanel: 'لوحة الإدارة',
    projects: 'المشاريع',
    users: 'المستخدمون',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    addNew: 'إضافة جديد',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    yes: 'نعم',
    no: 'لا',
    confirmDelete: 'هل أنت متأكد من حذف هذا العنصر؟',
    projectForm: {
      title: 'العنوان',
      description: 'الوصف',
      category: 'الفئة',
      client: 'العميل',
      date: 'التاريخ',
      image: 'رابط الصورة',
      images: 'صور إضافية',
      featured: 'مشروع مميز',
    },
    userForm: {
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      email: 'البريد الإلكتروني',
      name: 'الاسم الكامل',
      role: 'الدور',
    },
    stats: {
      totalProjects: 'إجمالي المشاريع',
      featuredProjects: 'المشاريع المميزة',
      totalUsers: 'إجمالي المستخدمين',
      recentProjects: 'أحدث المشاريع',
    },
  },
  common: {
    loading: 'جاري التحميل...',
    retry: 'إعادة المحاولة',
    viewMore: 'عرض المزيد',
    viewLess: 'عرض أقل',
    readMore: 'قراءة المزيد',
  },
  auth: {
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    signup: 'إنشاء حساب',
    forgotPassword: 'نسيت كلمة المرور؟',
    resetPassword: 'إعادة تعيين كلمة المرور',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    submit: 'إرسال',
    validation: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صالح',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      minLength: 'الحد الأدنى للطول هو {{length}} حرفًا',
    },
  },
  footer: {
    follow: 'تابعنا',
    subscribe: 'اشترك في نشرتنا الإخبارية',
    subscribeText: 'احصل على أحدث التحديثات والعروض',
    emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
    subscribeButton: 'اشترك',
    terms: 'شروط الخدمة',
    privacy: 'سياسة الخصوصية',
    rights: 'جميع الحقوق محفوظة',

  },
  testimonials: {
    title: 'ماذا يقول عملاؤنا',
    subtitle: 'اكتشف لماذا يحب العملاء العمل معنا وكيف ساعدناهم في تحقيق أهدافهم',
  },
  clients: {
    title: 'عملاؤنا',
    subtitle: 'نحن فخورون بالعمل مع مجموعة متنوعة من العملاء من مختلف الصناعات',
    satisfied: 'عملاء راضون',
  },
  awards: {
    title: 'جوائزنا',
    subtitle: 'لقد حصلنا على العديد من الجوائز تقديرًا لعملنا الإبداعي والمبتكر',
    won: 'جوائز فائزة',
  },
  projects: {
    title: 'مشاريعنا',
    subtitle: 'استكشف مجموعة من مشاريعنا المميزة التي تعكس مهاراتنا وإبداعنا',
    completed: 'مشاريع مكتملة',
  },
  years: {
    title: 'سنوات من الخبرة',
    subtitle: 'نحن نتمتع بخبرة واسعة في مجال التصميم الجرافيكي والإبداعي',
    experience: 'سنوات من الخبرة',
  },
};

// Configure i18next
const i18nInstance = i18n.createInstance();

// Initialize i18n
const initI18n = async () => {
  try {
    await i18nInstance
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        lng: getSavedLanguage(),
        fallbackLng: 'en',
        supportedLngs: ['en', 'ar'],
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
          escapeValue: false, // React already escapes values
        },
        resources: {
          en: {
            translation: enTranslations,
          },
          ar: {
            translation: arTranslations,
          },
        },
        detection: {
          order: ['localStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage'],
          lookupLocalStorage: 'i18nextLng',
          lookupFromPathIndex: 0,
          htmlTag: document.documentElement,
          checkWhitelist: true,
        },
        react: {
          useSuspense: true,
          bindI18n: 'languageChanged',
          bindI18nStore: '',
          transEmptyNodeValue: '',
          transSupportBasicHtmlNodes: true,
          transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'b', 'em'],
        },
      });
    
    console.log('i18n initialized successfully');
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
  }
};

// Initialize i18n
initI18n();

export default i18nInstance;
