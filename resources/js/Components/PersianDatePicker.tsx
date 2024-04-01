import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment/locale/fa"; // Import Pashto locale for Moment.js

const PashtoDatePicker = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    // Function to handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Custom date format function using Moment.js
    const customDateFormat = (date) => {
        return moment(date).format("YYYY/MM/DD"); // Format date in Gregorian
    };

    return (
        <div>
            <h2>Pashto Date Picker</h2>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat={customDateFormat} // Set custom date format
                locale="fa" // Set locale to Pashto
            />
        </div>
    );
};

export default PashtoDatePicker;
