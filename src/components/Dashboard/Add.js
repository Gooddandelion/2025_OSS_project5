import React, { useState } from 'react';
import Swal from 'sweetalert2';

const MOCK_API = "https://68db331023ebc87faa323b10.mockapi.io/employee";

const Add = ({ employees, setEmployees, setIsAdding }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [hometown, setHometown] = useState('');
  const [salary, setSalary] = useState('');
  const [date, setDate] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !salary || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    //이메일 양식 유효 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        showConfirmButton: true,
      });
    }

    // 급여 음수 검사
    if (isNaN(salary) || Number(salary) <= 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Invalid Salary',
        text: 'Salary must be a positive number.',
        showConfirmButton: true,
      });
    }

    // const id = employees.length + 1;

    const newEmployee = {
      firstName,
      lastName,
      email,
      hometown,
      salary,
      date,
    };


    // try...catch 블록으로 API 요청 로직을 감쌉니다.
    try {
      const response = await fetch(MOCK_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      // response.ok가 아닐 경우 (예: 서버 에러 404, 500) 에러를 발생시켜 catch 블록으로 보냅니다.
      if (!response.ok) {
        throw new Error('Something went wrong with the server.');
      }

      const addedEmployee = await response.json();
      setEmployees([...employees, addedEmployee]);
      setIsAdding(false);

      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: `${firstName} ${lastName}'s data has been Added.`,
        showConfirmButton: false,
        timer: 1500,
      });

    } catch (error) {
      // 네트워크 오류나 위에서 발생시킨 에러를 여기서 처리합니다.
      console.error("Failed to add employee:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Could not add the employee. Please try again.',
        showConfirmButton: true,
      });
    }
  };


  return (
    <div className="small-container">
      <form onSubmit={handleAdd}>
        <h1>Add Employee</h1>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="hometown">Hometown</label>
        <input
          id="hometown"
          type="text"
          name="hometown"
          value={hometown}
          onChange={e => setHometown(e.target.value)}
        />
        <label htmlFor="salary">Salary ($)</label>
        <input
          id="salary"
          type="number"
          name="salary"
          value={salary}
          onChange={e => setSalary(e.target.value)}
        />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Add;
