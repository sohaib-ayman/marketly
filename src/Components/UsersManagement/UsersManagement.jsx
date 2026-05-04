import React, { useEffect, useState } from "react";
import Style from "./UsersManagement.module.css";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));

                const usersData = querySnapshot.docs.map(docItem => ({
                    id: docItem.id,
                    ...docItem.data(),
                }));

                setUsers(usersData);

            } catch (err) {
                console.error(err);
            }
        }

        fetchUsers();
    }, []);

    async function confirmDelete() {
        try {
            await deleteDoc(doc(db, "users", userToDelete.id));

            setUsers(prev =>
                prev.filter(user => user.id !== userToDelete.id)
            );

            setUserToDelete(null);

        } catch (err) {
            console.error(err);
        }
    }

    return <>
        <div className={Style.panel}>
            <table className={Style.table}>
                <thead>
                    <tr>
                        <th className="py-3">USERNAME</th>
                        <th className="py-3">EMAIL</th>
                        <th className="py-3">ROLE</th>
                        <th className="py-3">ACTIONS</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="py-1">{user.name || "Unnamed"}</td>
                            <td className="py-1 text-secondary">{user.email}</td>
                            <td className="py-1"><span className={user.role === "admin" ? Style.adminBadge : Style.userBadge}>{user.role}</span></td>
                            <td className="py-1">{user.role === "admin" ? (<button disabled className="bg-transparent ps-0"><i className="fa-regular fa-trash-can"></i> Delete</button>) : (<button className={`${Style.deleteBtn} ps-0`} onClick={() => setUserToDelete(user)}><i className="fa-regular fa-trash-can"></i> Delete</button>)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {userToDelete && (
            <div className={Style.modalOverlay} onClick={() => setUserToDelete(null)}>
                <div className={Style.modal} onClick={(e) => e.stopPropagation()}>
                    <h4>Delete User</h4>
                    <p>Are you sure you want to delete{" "} <strong>{userToDelete.name}</strong>?</p>

                    <div className={Style.modalActions}>
                        <button className={Style.cancelBtn} onClick={() => setUserToDelete(null)}>Cancel</button>
                        <button className={Style.confirmBtn} onClick={confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        )}
    </>
}