import emailjs from '@emailjs/browser'
import './App.css';
const schedule = require('node-schedule')
const json = require('./employee_birthday.json')

const emailList = ['zno.ksy@gmail.com', 'ksytractor@hotmail.com', 'montree_s@hotmail.com']
async function sendEmployeeBirthDay() {
  const offset = 4
  const resp = await fetch(`https://ksy-api.herokuapp.com/employee/birthday?offset=${offset}`)
  const data = await resp.json()
  const employeesName = []
  data.forEach(employee => {
    employeesName.push(`${employee["name"]} (${employee["nickName"]})\n`)
  });
  try {
    if (employeesName.length > 0) {
      emailList.forEach(async (email) => {
        const sendResp = await emailjs.send("service_sdpje5r","ksy-birthday", {
          to_email: email,
          offset: offset,
          employee_list: employeesName.toString()
        }, "zrDvfvBlWz3V4tX7e")
        console.log('SUCCESS!', sendResp.status, sendResp.text)
      });
    } else {
      const sendResp = await emailjs.send("service_sdpje5r","ksy-birthday", {
        to_email: 'zno.ksy@gmail.com',
        offset: offset,
        employee_list: `There is no birthday for the incoming ${offset} days`
      }, "zrDvfvBlWz3V4tX7e")
      console.log('SUCCESS!', sendResp.status, sendResp.text)
    }
  } catch (err) {
    console.log(err)
  }
}

const rule = new schedule.RecurrenceRule()
rule.hour = 8
rule.minute = 0
rule.second = 0
const sendEmailJob = schedule.scheduleJob(rule, async () => {
  await sendEmployeeBirthDay()
})

async function stopSendEmailJob() {
  sendEmailJob.cancel()
}

async function continueSendEmailJob() {
  sendEmailJob.schedule()
}

export default function App() {
  return (
    <>
    <h1>KSY Dashboard</h1>
    <button onClick={ stopSendEmailJob }>Stop Send Email Job</button>
    <button onClick={ continueSendEmailJob }>Continue Send Email Job</button>
    <button onClick={ sendEmployeeBirthDay }>Send Email</button>
    <button onClick={ uploadExcelToDB }>Upload Excel File to DB</button>
    </>
  );
}

function uploadExcelToDB() {
  const lukkaeData = convertJsonToSchema(json["ลูกแก"])
  const nakhornData = convertJsonToSchema(json["นครปฐม"])
  lukkaeData.forEach(async (employee) => {
    let resp
    try {
      resp = await fetch("https://ksy-api.herokuapp.com/employee", {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
      })
      console.log(resp.json())
    } catch (err) {
      console.log(err)
      resp = err
    }
  });
  nakhornData.forEach(async (employee) => {
    let resp
    try {
      resp = await fetch("https://ksy-api.herokuapp.com/employee", {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
      })
      console.log(resp.json())
    } catch (err) {
      console.log(err)
      resp = err
    }
  });
}

function convertJsonToSchema(employees) {
  const employees_formatted = []
  employees.forEach(employee => {
    const formatJson = {
      name: employee["รายชื่อ"],
      nickName: employee["ชื่อเล่น"],
      birthDay: `${employee["ปี"] - 543}/${employee["เดือน"]}/${employee["วัน"]}`
    }
    employees_formatted.push(formatJson)
  });

  return employees_formatted
}




