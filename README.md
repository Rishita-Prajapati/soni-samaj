# Soni Samaj Udaipur - Community Management System

A comprehensive web application for managing the Soni Samaj community in Udaipur, built with React.js frontend and Node.js backend, using Supabase as the database.

## 🚀 Features

### Frontend (React.js)
- **Community Portal**: Home page with community information
- **Member Registration**: Online registration system for new members
- **Events Management**: Display of community events (Badhai, Shok, News, Birthdays)
- **Admin Panel**: Complete administrative interface
- **Responsive Design**: Mobile-friendly interface

### Admin Panel Features
- **Dashboard**: Overview of community statistics
- **Member Management**: Approve/reject member registrations
- **Event Management**: Create and manage different types of events
  - Badhai Events (Celebrations)
  - Shok Events (Condolences)
  - News Events
  - Birthday Events
- **Sangathan Management**: Organization committee management
- **Message Management**: Handle contact form submissions

### Backend (Node.js)
- **Authentication**: Secure admin authentication
- **API Endpoints**: RESTful APIs for all operations
- **Image Upload**: File handling for member photos and event images
- **Database Integration**: Supabase integration

## 🛠️ Technology Stack

- **Frontend**: React.js, CSS3, HTML5
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT-based authentication
- **File Storage**: Supabase Storage
- **Styling**: Custom CSS with responsive design

## 📁 Project Structure

```
samaj/
├── samaj/soni-samaj-udaipur/
│   ├── frontend/          # React.js application
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── pages/         # Page components
│   │   │   ├── services/      # API services
│   │   │   └── styles/        # CSS files
│   │   └── public/            # Static assets
│   ├── backend/           # Node.js server
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Authentication middleware
│   │   ├── models/            # Data models
│   │   └── utils/             # Utility functions
│   └── scripts/           # Database setup scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/soni-samaj-udaipur.git
   cd soni-samaj-udaipur
   ```

2. **Setup Frontend**
   ```bash
   cd samaj/soni-samaj-udaipur/frontend
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Configuration**
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Add your Supabase credentials and other configuration

5. **Database Setup**
   - Run the SQL scripts in the `scripts/` directory in your Supabase dashboard
   - Start with `01_main_tables.sql` and follow the sequence

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin/login

## 📖 Documentation

- [Admin Setup Guide](samaj/soni-samaj-udaipur/ADMIN_SETUP.md)
- [Integration Guide](samaj/soni-samaj-udaipur/INTEGRATION_GUIDE.md)
- [Quick Start Guide](samaj/soni-samaj-udaipur/QUICK_START_GUIDE.md)

## 🔧 Admin Panel Usage

1. **Login**: Use admin credentials to access the panel
2. **Dashboard**: View community statistics and recent activities
3. **Member Management**: Review and approve new member registrations
4. **Event Management**: Create and manage community events
5. **Message Management**: Handle contact form submissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries, please contact the development team or create an issue in the repository.

## 🙏 Acknowledgments

- Soni Samaj Udaipur community
- All contributors and supporters
- Open source libraries and frameworks used

---

**Built with ❤️ for the Soni Samaj Udaipur community**