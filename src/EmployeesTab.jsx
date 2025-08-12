"use client"; // Mark as client component for Next.js 13+ App Router

import React, { useState, useEffect } from "react";
import { employeesCollection } from "./firebase.js";

import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function EmployeesTab() {
  const [employees, setEmployees] = useState([]);
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editId, setEditId] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(employeesCollection, orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ docId: doc.id, ...doc.data() });
      });
      setEmployees(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function addEmployee() {
    if (!newName.trim() || !newRole.trim() || !newDetails.trim()) {
      alert("Please fill in the required fields.");
      return;
    }
    try {
      await addDoc(employeesCollection, {
        name: newName.trim(),
        id: newId.trim(),
        dob: newDob.trim(),
        role: newRole.trim(),
        details: newDetails.trim(),
        createdAt: new Date(),
      });
      setNewName("");
      setNewId("");
      setNewDob("");
      setNewRole("");
      setNewDetails("");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Try again.");
    }
  }

  function startEditing(emp) {
    setEditingId(emp.docId);
    setEditName(emp.name || "");
    setEditId(emp.id || "");
    setEditDob(emp.dob || "");
    setEditRole(emp.role || "");
    setEditDetails(emp.details || "");
  }

  async function saveEdit() {
    if (!editName.trim() || !editRole.trim() || !editDetails.trim()) {
      alert("Please fill in the required fields.");
      return;
    }
    try {
      await updateDoc(doc(employeesCollection, editingId), {
        name: editName.trim(),
        id: editId.trim(),
        dob: editDob.trim(),
        role: editRole.trim(),
        details: editDetails.trim(),
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to save changes. Try again.");
    }
  }

  async function deleteEmployee(docId) {
    try {
      await deleteDoc(doc(employeesCollection, docId));
      if (editingId === docId) setEditingId(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee.");
    }
  }

  if (loading) return <p>Loading employees...</p>;

  return (
    <div>
      <section id="add-employee-form" style={{ marginBottom: 24 }}>
        <h2>Add New Employee</h2>
        <input
          placeholder="Name *"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          placeholder="ID"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
        />
        <input
          placeholder="Date of Birth"
          value={newDob}
          onChange={(e) => setNewDob(e.target.value)}
        />
        <input
          placeholder="Role *"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        />
        <textarea
          placeholder="Details *"
          value={newDetails}
          onChange={(e) => setNewDetails(e.target.value)}
          rows={3}
        />
        <button onClick={addEmployee}>Add Employee</button>
      </section>

      <section id="employees-list">
        <h2>Existing Employees</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {employees.map((emp) => (
            <li
              key={emp.docId}
              style={{
                padding: 16,
                marginBottom: 12,
                border: "1px solid #5b21b6",
                borderRadius: 8,
              }}
            >
              {editingId === emp.docId ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name *"
                  />
                  <input
                    value={editId}
                    onChange={(e) => setEditId(e.target.value)}
                    placeholder="ID"
                  />
                  <input
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    placeholder="Date of Birth"
                  />
                  <input
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    placeholder="Role *"
                  />
                  <textarea
                    value={editDetails}
                    onChange={(e) => setEditDetails(e.target.value)}
                    placeholder="Details *"
                    rows={3}
                  />
                  <button onClick={saveEdit} style={{ marginRight: 10 }}>
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{emp.name}</strong> - <em>{emp.role}</em>
                  <br />
                  <small>ID: {emp.id || "-"}</small>
                  <br />
                  <small>DOB: {emp.dob || "-"}</small>
                  <br />
                  <p>{emp.details || "-"}</p>
                  <button onClick={() => startEditing(emp)}>Edit</button>
                  <button
                    onClick={() => deleteEmployee(emp.docId)}
                    style={{
                      marginLeft: 10,
                      backgroundColor: "#e11d48",
                      color: "#fff",
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
