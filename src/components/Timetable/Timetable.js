import NavigationBar from '../Navbar/Navbar'
import axios from 'axios';



const TimetablePage = () => {
  axios.get('/timetable')
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