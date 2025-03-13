export function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  // Format number with commas
  export function formatNumber(value) {
    return new Intl.NumberFormat().format(value);
  }
  
  // Calculate percentage
  export function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return (value / total) * 100;
  }
  
  // Get month name
  export function getMonthName(month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
  }
  