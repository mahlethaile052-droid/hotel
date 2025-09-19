# Supabase Integration Setup Guide

This guide will help you set up your hotel management system with Supabase for authentication and database operations.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js installed on your system
3. Your hotel management project files

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `hotel-management-system`
   - Database Password: (create a strong password)
   - Region: Choose the closest to your location
5. Click "Create new project"
6. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Configure Your Application

1. Open `/Users/wanofikumsa/hotel/js/supabase.js`
2. Replace the placeholder values:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL'  // Replace with your Project URL
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'  // Replace with your anon key
   ```

## Step 4: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `database-schema.sql` and paste it into the editor
4. Click "Run" to execute the SQL script
5. This will create all necessary tables and insert sample data

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your local development URL: `http://localhost:5173`
3. Under **Redirect URLs**, add: `http://localhost:5173`
4. Scroll down to **Email Auth** and make sure it's enabled
5. Optionally, you can disable email confirmation for development by going to **Authentication** → **Settings** → **Email** and unchecking "Enable email confirmations"

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5173`
3. You should see a loading screen, then your hotel management system

## Step 7: Create Your First User

Since the authentication system is now connected to Supabase, you'll need to create users through the Supabase dashboard:

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter email and password
4. Set the role in the **users** table (admin, manager, or staff)

Alternatively, you can create a signup form in your application using the `authManager.signup()` method.

## Database Schema

Your database includes the following tables:

- **employees**: Staff information (name, role, salary, etc.)
- **income**: Revenue tracking (category, amount, date)
- **expenses**: Cost tracking (category, amount, date)
- **inventory**: Stock management (name, quantity, price, etc.)
- **users**: User roles and permissions

## Key Features

### Authentication
- Email/password authentication
- Role-based access control (admin, manager, staff)
- Password reset functionality
- Session management

### Data Management
- Real-time data synchronization
- Automatic data validation
- Error handling and loading states
- Optimistic updates for better UX

### Security
- Row Level Security (RLS) enabled
- Secure API endpoints
- User-specific data access

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that you've correctly copied your Supabase URL and anon key
   - Ensure there are no extra spaces or characters

2. **"Failed to initialize" error**
   - Check your internet connection
   - Verify your Supabase project is active
   - Check the browser console for detailed error messages

3. **Authentication not working**
   - Verify your Site URL and Redirect URLs in Supabase settings
   - Check that email authentication is enabled
   - Ensure you're using the correct email format

4. **Database connection issues**
   - Verify the database schema was created successfully
   - Check that RLS policies are set up correctly
   - Ensure your user has the proper permissions

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Review the browser console for detailed error messages

## Next Steps

Once your setup is working:

1. Customize the user roles and permissions as needed
2. Add more sophisticated error handling
3. Implement real-time features using Supabase subscriptions
4. Add data validation and constraints
5. Set up automated backups
6. Configure production environment variables

## Production Deployment

When deploying to production:

1. Update your Supabase settings with your production domain
2. Use environment variables for sensitive configuration
3. Set up proper CORS policies
4. Configure SSL certificates
5. Set up monitoring and logging

Your hotel management system is now powered by Supabase! 🎉
