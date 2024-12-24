# Blood Bank Management System 🩸

A comprehensive web-based Blood Bank Management System built with React and Node.js that helps connect blood donors with blood banks and manages blood donation campaigns.

## Features 🌟

### For Users
- **User Registration & Authentication** 
  - Secure login/signup system
  - Password reset functionality
  - Role-based access control (Admin/User)

- **Blood Donation Management**
  - View upcoming donation campaigns
  - Schedule donation appointments
  - Track donation history
  - Receive notifications for donation opportunities

- **Blood Bank Directory**
  - Search blood banks by location
  - View real-time blood inventory
  - Check blood availability by type
  - Get directions to blood banks

### For Administrators
- **Dashboard Analytics**
  - Real-time blood inventory tracking
  - Donation statistics and trends
  - User activity monitoring

- **Campaign Management**
  - Create and manage donation campaigns
  - Track campaign performance
  - Manage appointment schedules

- **Inventory Management**
  - Track blood units by type
  - Monitor expiration dates
  - Manage blood bank locations

## Tech Stack 💻

### Frontend
- React.js
- TailwindCSS
- React Query
- React Router
- Lucide Icons
- Recharts

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Bcrypt

## Prerequisites 📋

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Installation 🚀

1. Clone the repository
```bash
git clone https://github.com/your-username/blood-bank-management.git
cd blood-bank-management
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Set up environment variables
- Create `.env` in the root directory for frontend:
```env
VITE_API_URL=http://localhost:5000
```
- Create `.env` in the backend directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=blood_bank_db
JWT_SECRET=your_jwt_secret
```

5. Initialize the database
```bash
cd backend
npm run init-db
```

6. Start the development servers
```bash
# In the root directory (frontend)
npm run dev

# In the backend directory
npm run dev
```

## Project Structure 📁

```
blood-bank-management/          
│   ├── src/          # React frontend
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── backend/           # Node.js backend
    ├── config/
    ├── routes/
    ├── middleware/
    └── scripts/
```

## API Documentation 📚

The API documentation is available at:
- Development: `http://localhost:5000/api-docs`
- Production: `https://your-api-domain.com/api-docs`

## Contributing 🤝

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

For support, contact us at B220091B@sc.edu.my or open an issue in the GitHub repository.

## Acknowledgements 🙏

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [Express](https://expressjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
