import { useEffect, useState } from "react";
import "../styles/Settings.css"
import type { bakeryDTO } from "../dto/bakeryDTO";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";

type mode = "nameAsc" | "nameDesc"

const BakerySettings: React.FC = () => {

    const [showMode, setShowMode] = useState<mode>("nameAsc");
    const { addToastNotification: addNotification } = useToastNotification();

    const [loadingBakeries, setLoadingBakeries] = useState(true);
    const [loadingBot, setLoadingBot] = useState(false);
    const [reload, setReload] = useState(false);
    const [bakeries, setBakeries] = useState<bakeryDTO[]>([]);
    const [showBakeries, setShowBakeries] = useState<bakeryDTO[]>([]);

    const [updateModal, setUpdateModal] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const [bakerySelected, setBakerySelected] = useState(0);

    const [name, setName] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [phone_number, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [imageToShow, setImageToShow] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setLogo(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const refreshBakeries = () => {
        setReload(prev => !prev);
    };

    const resetInputValues = () => {
        setName("");
        setLogo(null);
        setPhoneNumber("");
        setEmail("");
        setAddress("");
        setImageToShow("");
        setBakerySelected(0);
        setImagePreview(null);
    }

    const setInputValues = (bakery: bakeryDTO) => {
        resetInputValues();

        setBakerySelected(bakery.id);
        setName(bakery.name);
        setPhoneNumber(bakery.phone_number);
        setEmail(bakery.email);
        setAddress(bakery.address);
        setImageToShow(bakery.logo);
    }

    const addBakery = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        
        formData.append("name", name);
        formData.append("phone_number", phone_number);
        formData.append("email", email);
        formData.append("address", address);
        
        if(logo) {
            formData.append("logo", logo);
        }
        
        try {
            setLoadingBot(true);
            await api.post(`/bakery/add`, formData);
            refreshBakeries();
            setAddModal(false);
            addNotification("A Pastelaria foi adicionada.", false);
            
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

    const updateBakery = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        
        formData.append("phone_number", phone_number);
        formData.append("email", email);
        
        if(logo) {
            formData.append("logo", logo);
        }
        
        if(bakerySelected > 0) {
            try {
                setLoadingBot(true);
                await api.put(`/bakery/update/${bakerySelected}`, formData);
                refreshBakeries();
                setUpdateModal(false);
                addNotification("A Pastelaria foi atualizada.", false);
                
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

    const deleteBakery = async (id: number) => {
        if (id > 0) {
            try {
                await api.delete(`/bakery/delete/${id}`);
                refreshBakeries();
                addNotification("A Pastelaria foi eliminada.", false);
                
            } catch (err:any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro na comunicação com o Servidor.", true);

                }
            }
        }
    }

    useEffect (() => {
        const getBakeries = async () => {
            try {
                const response = await api.get(`/bakery/all`);
                setBakeries(response.data);
                
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
                setLoadingBakeries(false);
            }
        };

        getBakeries();
    }, [reload]);

    const changeShowMode = () => {
         
        if (showMode === "nameAsc") {
            setShowMode("nameDesc");
        } else {
            setShowMode("nameAsc");
        }
    }

    const sortByNameDesc = (arr: typeof bakeries) =>
        [...arr].sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowBakeries(bakeries);

        } else if (showMode === "nameDesc") {
            setShowBakeries(sortByNameDesc(bakeries));

        }

    }, [showMode, bakeries]);

    return (
        <>
            <div className="show-setting">
                <div className="header">
                    <h2>Gestão de Pastelarias</h2>
                    <button onClick={() => { resetInputValues(); setAddModal(true) }}><FaPlus /></button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="name" onClick={() => changeShowMode()}>
                                Pastelaria {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="button-container">
                                Atualizar
                            </th>
                            <th className="button-container">
                                Remover
                            </th>
                        </tr>
                    </thead>                  
                </table>

                <div className="table-body-settings">
                    <table className="cart-table">
                        <tbody>

                            {loadingBakeries ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {showBakeries.length === 0 ? (
                                        <tr>
                                            <td className="name">Não existem Pastelarias para mostrar.</td>
                                        </tr>
                                    ) : (
                                        showBakeries.map(bakery => (
                                            
                                            <tr key={bakery.id}>
                                                <td className="name" title={bakery.name}>{bakery.name}</td>
                                                <td className="button-container">
                                                    <button className="edit" onClick={() => {setInputValues(bakery); setUpdateModal(true)} }><FaPencilAlt /></button>
                                                </td>
                                                <td className="button-container">
                                                    <button className="remove" onClick={() => deleteBakery(bakery.id)}><RxCross1 /></button>
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
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={updateBakery}>
                        <button type="button" onClick={() => setUpdateModal(false)}><RxCross2 /></button>
                        
                        <h4>Logotipo</h4>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                        <div className="file-input">
                            <div className="inline-op">
                                <div className="image-div">
                                    <label htmlFor="image" className="upload-btn">
                                        {logo ? "Trocar imagem" : "Escolher imagem"}
                                    </label>

                                    {logo && <span title={logo.name}>{logo.name}</span>}
                                </div>
                                
                                <div className="image-div">
                                    <img src={imagePreview ? (imagePreview) : (imageToShow)} alt="imagem" title={imagePreview ? "Imagem escolhida" : "Imagem atual"}/>
                                </div>
                            </div>
                        </div>

                        <h4>Telefone (*)</h4>
                        <input
                            type="tel"
                            id="phone_number"
                            minLength={9}
                            maxLength={9}
                            placeholder='Insira o número de telefone da pastelaria...'
                            value={phone_number}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />

                        <h4>Email (*)</h4>
                        <input
                            type="email"
                            id="email"
                            placeholder='Insira o email da pastelaria...'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        
                        <button type="submit" className="submit">{loadingBot ? (<div className="spinner"></div>) : (<>Atualizar Pastelaria</>)}</button>

                    </form>
                </div>
            )}
            
            {addModal && (
                <div onClick={() => setAddModal(false)} className="back-modal">
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={addBakery}>
                        <button type="button" onClick={() => setAddModal(false)}><RxCross2 /></button>
                        
                        <h4 className="first">Nome (*)</h4>
                        <input
                            type="text"
                            id="name"
                            placeholder='Insira o nome da pastelaria...'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <h4>Logotipo</h4>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                        <div className="file-input">
                            <div className="inline-op">
                                <div className="image-div">
                                    <label htmlFor="image" className="upload-btn">
                                        {logo ? "Trocar imagem" : "Escolher imagem"}
                                    </label>

                                    {logo && <span title={logo.name}>{logo.name}</span>}
                                </div>
                                
                                <div className="image-div">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="imagem" title="Imagem escolhida"/>
                                    )}
                                    
                                </div>
                            </div>
                        </div>

                        <h4>Telefone (*)</h4>
                        <input
                            type="tel"
                            id="phone_number"
                            minLength={9}
                            maxLength={9}
                            placeholder='Insira o número de telefone da pastelaria...'
                            value={phone_number}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />

                        <h4>Email (*)</h4>
                        <input
                            type="email"
                            id="email"
                            placeholder='Insira o email da pastelaria...'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <h4>Morada (*)</h4>
                        <textarea
                            placeholder='Insira a morada da pastelaria...'
                            className="notes-box"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        
                        <button type="submit" className="submit">{loadingBot ? (<div className="spinner"></div>) : (<>Adicionar Pastelaria</>)}</button>
                        
                        
                    </form>
                </div>
            )}
        </>
    )
}

export default BakerySettings