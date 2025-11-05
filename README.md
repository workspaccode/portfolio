# Portfolio Management System

A modern portfolio website with admin panel, built with Next.js 15, TypeScript, and Supabase. Manage your projects without touching code - everything is controlled through the Supabase database and admin interface.

## Features

- 🎨 **Modern Portfolio Display** - Beautiful, responsive portfolio showcase
- 🔐 **Secure Admin Panel** - Username/password protected admin interface
- 🛠️ **Complete CRUD Operations** - Create, read, update, delete projects
- 📸 **Image Upload** - Direct image upload to Supabase Storage
- ⭐ **Featured Projects** - Highlight your best work
- 🏷️ **Technology Tags** - Organize projects by tech stack
- 🔗 **Project Links** - GitHub and live demo links
- 📱 **Responsive Design** - Works perfectly on all devices
- 🌙 **Dark Mode Support** - Built-in theme switching
- 🚀 **Session Management** - Secure authentication with cookies

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for images
- **UI Components**: shadcn/ui with Radix UI primitives

## Quick Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd portfolio-management
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Run the SQL setup script from `supabase-setup.sql` in your Supabase SQL Editor

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## Usage

### Managing Projects

1. **Access Admin Panel**: Navigate to `/admin/login` or click "Admin Panel" in the navigation
2. **Login Credentials**: 
   - Username: `admin`
   - Password: `admin123`
   - ⚠️ **Important**: Change these credentials in production by editing `src/lib/auth.ts`
3. **Add New Project**: Click "Add Project" and fill in the details
4. **Edit Projects**: Click the edit icon on any project card
5. **Delete Projects**: Click the trash icon to remove projects
6. **Upload Images**: Use the upload button or provide direct image URLs
7. **Logout**: Click the logout button in the admin header

### Project Fields

- **Title**: Project name
- **Description**: Detailed project description
- **Image**: Project screenshot or demo image
- **Technologies**: Comma-separated list of technologies used
- **GitHub URL**: Link to source code (optional)
- **Live URL**: Link to live demo (optional)
- **Featured**: Mark as featured to highlight on homepage

### Database Management

All project data is stored in your Supabase database. You can:

- View and edit data directly in Supabase Dashboard
- Export/import data as needed
- Set up additional automation with Supabase Edge Functions
- Add custom fields by modifying the database schema

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin panel route
│   ├── api/
│   │   └── projects/    # API routes for CRUD operations
│   └── page.tsx         # Portfolio homepage
├── components/
│   └── ui/              # shadcn/ui components
└── lib/
    └── supabase.ts      # Supabase client configuration
```

## Customization

### Adding New Fields

1. Update the database schema in Supabase
2. Update the TypeScript types in `src/lib/supabase.ts`
3. Modify the admin form in `src/app/admin/page.tsx`
4. Update the project display in `src/app/page.tsx`

### Styling

The project uses Tailwind CSS with shadcn/ui components. You can:

- Modify colors in `tailwind.config.js`
- Update component styles in `src/components/ui/`
- Add custom CSS classes as needed

### Adding New Pages

1. Create a new directory in `src/app/`
2. Add a `page.tsx` file
3. Update navigation in the header components

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Security Notes

- The current setup uses simple username/password authentication
- **Default credentials**: admin / admin123 (change these in production!)
- To change credentials, edit the `ADMIN_USERNAME` and `ADMIN_PASSWORD` constants in `src/lib/auth.ts`
- For production, consider implementing proper password hashing and database storage
- Sessions are managed via secure HTTP-only cookies
- Admin operations require authentication
- Image uploads are currently public - consider adding authentication for production
- Always validate user input in production applications

### Changing Admin Credentials

1. Open `src/lib/auth.ts`
2. Update the `ADMIN_USERNAME` and `ADMIN_PASSWORD` constants
3. Restart your application for changes to take effect

```typescript
const ADMIN_USERNAME = 'your-username'
const ADMIN_PASSWORD = 'your-secure-password'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues:

1. Check the Supabase setup guide
2. Verify environment variables
3. Check browser console for errors
4. Review the Supabase logs

---

Built with ❤️ using Next.js and Supabase