import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./calendar.css";

interface CalendarProps {
    completedDates: number[];
    onMonthChange: (year: number, month: number) => void;
    onDayClick: (year: number, month: number, day: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
    completedDates,
    onMonthChange,
    onDayClick,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        onMonthChange(year, month + 1);
    }, [year, month, onMonthChange]);

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    let firstDayWeekday = firstDayOfMonth.getDay();
    firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    const days = [];
    for (let i = 0; i < firstDayWeekday; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const isToday = (day: number | null) => {
        if (!day) return false;
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };
const handleDayClick = (day: number | null) => {
        if (!day || !completedDates.includes(day)) return;
        onDayClick(year, month + 1, day);
    };

    
    return (
        <div className="calendar">
            <div className="calendar-header">
                <button
                    onClick={goToPreviousMonth}
                    className="calendar-nav-btn"
                >
                    <ChevronLeft size={20} />
                </button>
                <h2 className="calendar-title">
                    {monthNames[month]} {year}
                </h2>
                <button onClick={goToNextMonth} className="calendar-nav-btn">
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className="calendar-weekdays">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
            </div>
            <div className="calendar-days">
                {days.map((day, index) => ( ${
                            day && completedDates.includes(day)
                                ? "calendar-day--clickable"
                                : ""
                        }`}
                        onClick={() => handleDayClick(day)
                    <div
                        key={index}
                        className={`calendar-day ${
                            day ? "" : "calendar-day--empty"
                        } ${isToday(day) ? "calendar-day--today" : ""}`}
                    >
                        {day && (
                            <>
                                <span className="calendar-day-number">
                                    {day}
                                </span>
                                {completedDates.includes(day) && (
                                    <span className="calendar-day-dot" />
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
