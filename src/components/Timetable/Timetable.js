import NavigationBar from '../Navbar/Navbar'
import axios from 'axios';



const TimetablePage = () => {
  axios.get('http://localhost:4000/timetable')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

    return (
        <div>
        <NavigationBar/>
        Timetable
        </div>
      );
};

export default TimetablePage;