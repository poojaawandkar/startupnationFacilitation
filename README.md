# Facilitator Network - Incubation Center Platform

A React-based web application for managing and displaying incubation centers, accelerators, and startup facilitation bodies.

## Features

### 🏠 Home Page
- **Facilitator Network**: Display all registered incubation centers
- **Filtering**: Filter by country and domain
- **Register Button**: Easy access to registration form
- **Individual Pages**: Click on any center to view detailed information

### 📝 Registration Form
- **Company Information**: Logo, name, email, website, unique selling point
- **Center Details**: Type, location, domain, services, startups incubated
- **Support Information**: Remuneration type, YouTube link
- **Validation**: Comprehensive form validation with error messages
- **Success Page**: Confirmation message after successful registration

### 🏢 Individual Center Pages
- **Detailed Information**: Complete center details and description
- **Contact Options**: Direct contact and website links
- **Responsive Design**: Works on all device sizes

## Technology Stack

- **Frontend**: React 19.1.0
- **Routing**: React Router DOM
- **Styling**: CSS3 with modern design
- **Backend**: Supabase (planned integration)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-react-app-update
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── App.js                 # Main application with routing
├── App.css               # Main application styles
├── postIncubation.js     # Registration form component
├── postIncubation.css    # Registration form styles
├── incubationDetails.js  # Individual center page component
├── incubationDetails.css # Individual center page styles
├── services/
│   └── incubationService.js  # Supabase integration service
└── assets1/
    └── logo_result.webp  # Application logo
```

## Routes

- `/` - Home page with all incubation centers
- `/register` - Registration form for new centers
- `/center/:id` - Individual center details page

## Form Fields

### Company Information
- Company Logo (required)
- Company Name (required)
- Company Email (required)
- Company Website (required)
- Unique Selling Point (max 2 sentences, required)

### Incubation Center Details
- Incubation Center Type (required)
  - Incubation center
  - Accelerator
  - Venture capital
  - Entrepreneurship cell
  - Startup clubs
  - School/college startup facilitation body
- Location (required)
- Domain (required)
- Services (Remote/Onsite/Hybrid, required)
- Startups Incubated (number, required)
- Support Remuneration (required)
  - Equity based
  - Fee based
  - Hybrid (equity + fee)
- YouTube Link (required)

## Supabase Integration (Planned)

The application is designed to integrate with Supabase for data storage:

1. **Database Table**: `incubation_centers`
2. **Storage**: Logo file uploads
3. **Authentication**: User management (future feature)

### Environment Variables (for Supabase)
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Styling

The application uses a modern, clean design with:
- **Color Scheme**: Yellow (#f5c13b) and dark gray (#232323)
- **Typography**: Clean, readable fonts
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects

## Future Enhancements

- [ ] Supabase integration for data persistence
- [ ] User authentication and admin panel
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
