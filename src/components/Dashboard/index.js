import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';

//import { employeesData } from '../../data';

const MOCK_API = "https://68db331023ebc87faa323b10.mockapi.io/employee";

const Dashboard = ({ setIsAuthenticated }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [sortOrder, setSortOrder] = useState('none');

  /*
    // 기존 코드 
      useEffect(() => {
        const data = JSON.parse(localStorage.getItem('employees_data'));
        if (data !== null && Object.keys(data).length !== 0) setEmployees(data);
    }, []);
  */

  useEffect(() => {
    fetch(MOCK_API)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Failed to fetch employees:", err));
  }, []);


  const handleEdit = id => {
    //const [employee] = employees.filter(employee => employee.id === id);
    const employee = employees.find(emp => emp.id === id);

    setSelectedEmployee(employee);
    setIsEditing(true);
  };


  const handleDelete = id => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.isConfirmed) {
        /*
          const [employee] = employees.filter(employee => employee.id === id);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `${employee.firstName} ${employee.lastName}'s data has been deleted.`,
            showConfirmButton: false,
            timer: 1500,
          });

          const employeesCopy = employees.filter(employee => employee.id !== id);
          localStorage.setItem('employees_data', JSON.stringify(employeesCopy));
          setEmployees(employeesCopy);
        */

        fetch(`${MOCK_API}/${id}`, { method: 'DELETE' })
          .then(() => {
            setEmployees(employees.filter(emp => emp.id !== id));
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Employee data has been deleted.',
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch(err => console.error("Delete failed:", err)); 

      }
    });
  };

  // sort 함수 선언
  const handleSort = () => {
    setSortOrder(currentOrder => {
      if (currentOrder === 'none') return 'ascending';
      if (currentOrder === 'ascending') return 'descending';
      return 'none';
    });
  };

  // 오름차순 또는 내림차순 배열 
  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortOrder === 'ascending') {
      return Number(a.salary) - Number(b.salary);
    }
    if (sortOrder === 'descending') {
      return Number(b.salary) - Number(a.salary);
    }
    return 0; // 순서 변경 없음
  });

  return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
          <Header
            setIsAdding={setIsAdding}
            setIsAuthenticated={setIsAuthenticated}
          />
          <Table
            employees={sortedEmployees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleSort={handleSort}
            sortOrder={sortOrder}
          />
        </>
      )}
      {isAdding && (
        <Add
          employees={employees}
          setEmployees={setEmployees}
          setIsAdding={setIsAdding}
        />
      )}
      {isEditing && (
        <Edit
          employees={employees}
          selectedEmployee={selectedEmployee}
          setEmployees={setEmployees}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Dashboard;
