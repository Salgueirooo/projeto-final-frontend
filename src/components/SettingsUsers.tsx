import { useEffect, useState } from "react";
import "../styles/Settings.css"
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import type { RoleDTO } from "../dto/roleDTO";
import type { UserDTO } from "../dto/userDTO";
import { FaPencilAlt } from "react-icons/fa";

type mode = "nameAsc" | "nameDesc"

const UserSettings: React.FC = () => {

    const [showMode, setShowMode] = useState<mode>("nameAsc");
    const { addToastNotification: addNotification } = useToastNotification();

    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingBot, setLoadingBot] = useState(false);
    const [reload, setReload] = useState(false);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [showUsers, setShowUsers] = useState<UserDTO[]>([]);
    const [roles, setRoles] = useState<RoleDTO[]>([]);

    const [updateModal, setUpdateModal] = useState(false);

    const [userSelected, setUserSelected] = useState(0);
    const [role, setRole] = useState("");
    const [roleSelected, setRoleSelected] = useState("");

    const refreshUsers = () => {
        setReload(prev => !prev);
    };

    const setInputValues = (user: UserDTO) => {
        resetInputValues();

        setRole(user.role);
    }

    const resetInputValues = () => {
        setRole("");
        setRoleSelected("");
    }

    useEffect (() => {
        if (role.length > 0 && roles.length > 0) {
            const roleSelect = roles.find(r => r.description === role);

            if (!roleSelect) return;

            setRoleSelected(roleSelect.role);
        }

    }, [role]);

    const updateUser = async (event: React.FormEvent) => {
        event.preventDefault();   
        
        if (userSelected > 0) {
            try {
                setLoadingBot(true);
                await api.put(`/user/update-role/${userSelected}`, roleSelected,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                refreshUsers();
                setUpdateModal(false);
                addNotification("O Utilizador foi atualizado.", false);
                
            } catch (err:any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro na comunicação com o Servidor.", true);

                }
            } finally {
                setLoadingBot(false);
            }
        }
        
    }

    useEffect (() => {
        const getIngredients = async () => {
            try {
                const response = await api.get(`/user/all`);
                setUsers(response.data);
                
            } catch (err:any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro na comunicação com o Servidor.", true);

                }
            } finally {
                setLoadingUsers(false);
            }
        };

        getIngredients();
    }, [reload]);

    useEffect (() => {
        const getRoles= async () => {
            try {
                const response = await api.get(`/initialize/get-roles`);
                setRoles(response.data);
                
            } catch (err:any) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            } 
        };

        getRoles();
    }, []);

    const changeShowMode = () => {
         
        if (showMode === "nameAsc") {
            setShowMode("nameDesc");
        } else {
            setShowMode("nameAsc");
        }
    }

    const sortByNameDesc = (arr: typeof users) =>
        [...arr].sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowUsers(users);

        } else if (showMode === "nameDesc") {
            setShowUsers(sortByNameDesc(users));

        }

    }, [showMode, users]);

    return (
        <>
            <div className="show-setting">
                <div className="header">
                    <h2>Gestão de Utilizadores</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="name" onClick={() => changeShowMode()}>
                                Utilizadores {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="role-container">
                                Cargo
                            </th>
                            <th className="button-container">
                                Atualizar
                            </th>
                        </tr>
                    </thead>                  
                </table>

                <div className="table-body-settings">
                    <table className="cart-table">
                        <tbody>

                            {loadingUsers ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {showUsers.length === 0 ? (
                                        <tr>
                                            <td className="name">Não existem Ingredientes para mostrar.</td>
                                        </tr>
                                    ) : (
                                        showUsers.map(user => (
                                            
                                            <tr key={user.id}>
                                                <td className="name" title={user.email}>{user.email}</td>
                                                <td className="role-container">{user.role}</td>
                                                <td className="button-container">
                                                    <button className="edit" onClick={() => {setUserSelected(user.id); setInputValues(user); setUpdateModal(true);}}><FaPencilAlt /></button>
                                                </td>
                                            </tr>

                                        ))
                                    )} 
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {updateModal && (
                <div onClick={() => setUpdateModal(false)} className="back-modal">
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={updateUser}>
                        <button type="button" onClick={() => setUpdateModal(false)}><RxCross2 /></button>
                        
                        <h4>Cargo (*)</h4>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Selecione um cargo...
                            </option>

                            {roles.map((role) => (
                                <option key={role.role} value={role.description}>
                                    {role.description}
                                </option>
                            ))}
                        </select>
                        
                        <button type="submit" className="submit">{loadingBot ? (<div className="spinner"></div>) : (<>Alterar Cargo</>)}</button>

                    </form>
                </div>
            )}
        </>
    )
}

export default UserSettings