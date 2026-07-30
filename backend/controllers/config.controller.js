// Configuration controller for WhatsApp support and Contact details
const getConfig = async (req, res) => {
  try {
    // Configuration - can be moved to database later
    const config = {
      whatsapp: {
        phoneNumber: '919799550948',
        defaultMessage: 'Hello%2C%20mujhe%20courses%20ke%20baare%20me%20information%20chahiye',
        displayMessage: 'Hello, mujhe courses ke baare me information chahiye'
      },
      support: {
        email: 'support@skillai.training',
        phone: '+91-97995-50948',
        workingHours: {
          weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
          saturday: 'Saturday: 10:00 AM - 4:00 PM',
          sunday: 'Sunday: Closed'
        },
        responseTime: 'Within 24 hours'
      }
    };

    res.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configuration'
    });
  }
};

module.exports = {
  getConfig
};
