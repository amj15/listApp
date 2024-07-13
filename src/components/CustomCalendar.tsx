import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Card, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Button, TextField } from '@mui/material';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const CalendarContainer = styled.div`
  width: 100%;

  .react-calendar {
    width: 100%;
    border: none;
  }

  .react-calendar__tile {
    max-width: 100%;
  }

  .react-calendar__month-view__days__day {
    margin: 5px 0;
  }
`;

const CalendarTile = styled(Card)<{ hasEvents: boolean }>`
  min-height: 100px;
  padding: 10px;
  background-color: ${({ hasEvents }) => (hasEvents ? '#f0f8ff' : '#ffffff')};
`;

interface EventData {
  id: string;
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

const CustomCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ summary: '', description: '', start: '', end: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDateClick = (value: Date) => {
    const dateStr = value.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateEvent = async () => {
    try {
      await axios.post('/create-event', newEvent);
      fetchEvents();
      setOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axios.delete(`/delete-event/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const eventsByDate = events.reduce((acc, event) => {
    const dateStr = event.start.dateTime.split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {} as { [key: string]: EventData[] });

  return (
    <CalendarContainer>
      <Calendar
        value={date}
        onChange={setDate}
        onClickDay={handleDateClick}
        tileContent={({ date }) => {
          const dateStr = date.toISOString().split('T')[0];
          const hasEvents = Boolean(eventsByDate[dateStr]);

          return (
            <CalendarTile hasEvents={hasEvents}>
              {date.getDate()}
            </CalendarTile>
          );
        }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Events for {selectedDate}</DialogTitle>
        <DialogContent>
          <List>
            {selectedDate && eventsByDate[selectedDate]?.map((event) => (
              <ListItem key={event.id}>
                <ListItemText primary={event.summary} secondary={event.description} />
                <Button onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
              </ListItem>
            ))}
          </List>
          <TextField
            label="Summary"
            value={newEvent.summary}
            onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            fullWidth
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
            fullWidth
          />
          <TextField
            label="End Time"
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            fullWidth
          />
          <Button onClick={handleCreateEvent} color="primary" variant="contained">
            Create Event
          </Button>
        </DialogContent>
      </Dialog>
    </CalendarContainer>
  );
};

export default CustomCalendar;
