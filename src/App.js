import emailjs from '@emailjs/browser'
import './App.css';
const schedule = require('node-schedule')

async function sendEmployeeBirthDay() {
  const offset = 1
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
    console.log(employeeNames.length)
  } catch (err) {
    console.log(err)
  }
}

const rule = new schedule.RecurrenceRule()
rule.hour = 19
rule.tz = 'Etc/UTC'
const sendEmailJob = schedule.scheduleJob(rule, async () => {
  await sendEmployeeBirthDay()
})

async function stopSendEmailJob() {
  sendEmailJob.cancel()
}

export default function App() {
  return (
    <>
    <h1>KSY Dashboard</h1>
    <button onClick={ stopSendEmailJob }>Stop Send Email Job</button>
    <button onClick={ sendEmployeeBirthDay }>Send Email</button>
    </>
  );
}



