import emailjs from '@emailjs/browser'
import './App.css';
const schedule = require('node-schedule')

const sendEmployeeBirthDay = async () => {
  const offset = 3
  const resp = await fetch(`https://ksy-api.herokuapp.com/employee/birthday?offset=${offset}`)
  const data = await resp.json()
  const employeeNames = []
  data.forEach(employee => {
    employeeNames.push(employee["name"])
  });
  try {
    if (employeeNames.length > 0) {
      const sendResp = await emailjs.send("service_sdpje5r","ksy-birthday", {
        to_email: 'zno.ksy@gmail.com',
        offset: offset,
        employee_list: employeeNames.toString()
      }, "zrDvfvBlWz3V4tX7e")
      console.log('SUCCESS!', sendResp.status, sendResp.text)
    }
  } catch (err) {
    console.log(err)
  }
}

const sendEmailJob = schedule.scheduleJob('25 * * * *', sendEmployeeBirthDay)

const stopSendEmailJob = async () => {
  sendEmailJob.cancel()
}

export default function App() {
  return (
    <>
    <h1>KSY Dashboard</h1>
    <button onClick={ stopSendEmailJob }>Stop Send Email Job</button>
    </>
  );
}


