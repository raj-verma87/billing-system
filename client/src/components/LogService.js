// LogService.js (React)
const logToServer = async (level, message) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await fetch(`${apiUrl}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, message }),
      });
    } catch (err) {
      console.error('Failed to send log:', err);
    }
  };
  
  export default logToServer;
  