import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import BuzzerDataInterface from "../interface/BuzzerDataInterface";

function ShowBuzzerData() {
  const [data, setData] = useState<BuzzerDataInterface[]>([]);
  const [filteredData, setFilteredData] = useState<BuzzerDataInterface[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:8080/allbuzzerdata")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((fetchedData: BuzzerDataInterface[]) => {
          console.log(fetchedData);
  
          setData(fetchedData);
  
          const uniqueDates = Array.from(new Set(fetchedData.map(item => item.date)));
  
          if (uniqueDates.includes(selectedDate)) {
            setDates(uniqueDates);
          } else {
            setDates(uniqueDates);
            setSelectedDate(uniqueDates[0]);
          }
  
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false); 
        });
    };
  
    fetchData();
  
    const interval = setInterval(fetchData, 10000);
  
    return () => clearInterval(interval);
  }, [selectedDate]); 

  useEffect(() => {
    const filtered = data.filter(item => item.date === selectedDate);
    setFilteredData(filtered);
  }, [data, selectedDate]);

  if (loading) {
    return <p>Laddar...</p>;
  }

  if (error) {
    return <p>Fel: {error}</p>;
  }

  return (
    <>
      <h3>Här visas statistik på hur många gånger någon har försökt att roffa åt sig av ditt godis, men misslyckats!</h3>
      <label htmlFor="dateSelector">Välj datum: </label>
      <select
        id="dateSelector"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}>
        {dates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="90%" height={500}>
        <LineChart data={filteredData}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => value.slice(0, 5)}
          />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Legend />
          <Line type="monotone" dataKey="buzzCount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <p>Grafen uppdateras 1 gång i timmen</p>
    </>
  );
}

export default ShowBuzzerData;