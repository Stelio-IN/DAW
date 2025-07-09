import React, { useState } from 'react';
import '../../assets/style/AdminUsuario.css';

const CustomersScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [users] = useState([
    { id: 1, name: "Ananda Harvey", email: "amanda@site.com", country: "United Kingdom", orders: 3, totalSpent: "$3,511.01" },
    { id: 2, name: "Anne Richard", email: "anne@site.com", country: "United States", orders: 1, totalSpent: "$235.00" },
    { id: 3, name: "David Harrison", email: "david@site.com", country: "United States", orders: 53, totalSpent: "$346,410.12" },
    { id: 4, name: "Finch Hoot", email: "finch@site.com", country: "Argentina", orders: 12, totalSpent: "$1,350.04" },
    { id: 5, name: "Bob Dean", email: "bob@site.com", country: "Austria", orders: 8, totalSpent: "$912.13" },
    { id: 6, name: "Ella Lauda", email: "ella@site.com", country: "United Kingdom", orders: 5, totalSpent: "$451.66" },
    { id: 7, name: "Lori Hunter", email: "hunter@site.com", country: "Estonia", orders: 11, totalSpent: "$3,582.46" },
  ]);

  // Agrupar usuários por letra inicial
  const groupedUsers = users.reduce((acc, user) => {
    const firstLetter = user.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(user);
    return acc;
  }, {});

  return (
    <div className="customers-screen">
      <header className="customers-header">
        <h1>Customers</h1>
        <div className="tabs">
          <div className="tab-group">
            <span>All</span>
            <div className="tab-items">
              <button 
                className={activeTab === 'New' ? 'active' : ''}
                onClick={() => setActiveTab('New')}
              >
                New
              </button>
              <button 
                className={activeTab === 'Active' ? 'active' : ''}
                onClick={() => setActiveTab('Active')}
              >
                Active
              </button>
              <button 
                className={activeTab === 'Inactive' ? 'active' : ''}
                onClick={() => setActiveTab('Inactive')}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="search-container">
        <div className="search-input">
          <input type="text" placeholder="Search by name, email" />
        </div>
        <div className="actions">
          <button className="sort-btn">Sort by</button>
          <button className="filter-btn">Filter</button>
        </div>
      </div>

      <div className="divider"></div>

      <div className="customers-grid">
        <div className="grid-header">
          <div>NAME</div>
          <div>E-MAIL</div>
          <div>COUNTRY</div>
          <div>ORDERS</div>
          <div>TOTAL SPENT</div>
        </div>

        {Object.entries(groupedUsers).map(([letter, usersInGroup]) => (
          <React.Fragment key={letter}>
            <div className="group-header">{letter}</div>
            {usersInGroup.map(user => (
              <div key={user.id} className="customer-item">
                <div className="customer-name">
                  <div className="name">{user.name}</div>
                  <div className="email">{user.email}</div>
                </div>
                <div className="customer-country">{user.country}</div>
                <div className="customer-orders">{user.orders}</div>
                <div className="customer-total">{user.totalSpent}</div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="pagination">
        Showing 1-07 of 220 entries
      </div>
    </div>
  );
};

export default CustomersScreen;