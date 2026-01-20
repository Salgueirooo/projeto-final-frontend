import { useEffect, useState } from "react";
import "../styles/Settings.css"
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import type { CategoryDTO } from "../dto/categoryDTO";

type mode = "nameAsc" | "nameDesc"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategorySettings: React.FC = () => {

    const [showMode, setShowMode] = useState<mode>("nameAsc");
    const { addToastNotification: addNotification } = useToastNotification();

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [reload, setReload] = useState(false);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [showCategories, setShowCategories] = useState<CategoryDTO[]>([]);

    const [updateModal, setUpdateModal] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const [categorySelected, setCategorySelected] = useState(0);

    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [imageToShow, setImageToShow] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImage(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const refreshCategories = () => {
        setReload(prev => !prev);
    };

    const resetInputValues = () => {
        setName("");
        setImage(null);
        setImageToShow("");
        setCategorySelected(0);
        setImagePreview(null);
    }

    const setInputValues = (category: CategoryDTO) => {
        resetInputValues();
        
        setCategorySelected(category.id);
        setName(category.name);
        setImageToShow(`${BASE_URL}${category.image}`);
    }

    const addCategory = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        
        formData.append("name", name);
        
        if(image) {
            formData.append("image", image);
        }
        
        try {
            await api.post(`/category/add`, formData);
            refreshCategories();
            setAddModal(false);
            addNotification("A Categoria foi adicionada.", false);
            
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

    const updateCategory = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        
        if(image) {
            formData.append("image", image);

            if(categorySelected > 0) {
                try {
                    await api.put(`/category/update/${categorySelected}`, formData);
                    refreshCategories();
                    setUpdateModal(false);
                    addNotification("A Categoria foi atualizada.", false);
                    
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
    }

    const deleteCategory = async (id: number) => {
        if (id > 0) {
            try {
                await api.delete(`/category/delete/${id}`);
                refreshCategories();
                addNotification("A Categoria foi eliminada.", false);
                
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
        const getCategory = async () => {
            try {
                const response = await api.get(`/category/all`);
                setCategories(response.data);
                
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
                setLoadingCategories(false);
            }
        };

        getCategory();
    }, [reload]);

    const changeShowMode = () => {
         
        if (showMode === "nameAsc") {
            setShowMode("nameDesc");
        } else {
            setShowMode("nameAsc");
        }
    }

    const sortByNameDesc = (arr: typeof categories) =>
        [...arr].sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowCategories(categories);

        } else if (showMode === "nameDesc") {
            setShowCategories(sortByNameDesc(categories));

        }

    }, [showMode, categories]);

    return (
        <>
            <div className="show-setting">
                <div className="header">
                    <h2>Gestão de Categorias</h2>
                    <button onClick={() => { resetInputValues(); setAddModal(true) }}><FaPlus /></button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="name" onClick={() => changeShowMode()}>
                                Categoria {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
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

                            {loadingCategories ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {showCategories.length === 0 ? (
                                        <tr>
                                            <td className="name">Não existem Categorias para mostrar.</td>
                                        </tr>
                                    ) : (
                                        showCategories.map(category => (
                                            
                                            <tr key={category.id}>
                                                <td className="name" title={category.name}>{category.name}</td>
                                                <td className="button-container">
                                                    <button className="edit" onClick={() => {setInputValues(category); setUpdateModal(true)} }><FaPencilAlt /></button>
                                                </td>
                                                <td className="button-container">
                                                    <button className="remove" onClick={() => deleteCategory(category.id)}><RxCross1 /></button>
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
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={updateCategory}>
                        <button type="button" onClick={() => setUpdateModal(false)}><RxCross2 /></button>
                        
                        
                        <h4 className="first">Imagem</h4>
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
                                        {image ? "Trocar imagem" : "Escolher imagem"}
                                    </label>

                                    {image && <span title={image.name}>{image.name}</span>}
                                </div>
                                
                                <div className="image-div">
                                    <img src={imagePreview ? (imagePreview) : (imageToShow)} alt="imagem" title={imagePreview ? "Imagem escolhida" : "Imagem atual"}/>
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" className="submit">Atualizar Categoria</button>
 
                    </form>
                </div>
            )}
            
            {addModal && (
                <div onClick={() => setAddModal(false)} className="back-modal">
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={addCategory}>
                        <button type="button" onClick={() => setAddModal(false)}><RxCross2 /></button>
                        
                        <h4 className="first">Nome (*)</h4>
                        <input
                            type="text"
                            id="name"
                            placeholder='Insira o nome da categoria...'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <h4>Imagem</h4>
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
                                        {image ? "Trocar imagem" : "Escolher imagem"}
                                    </label>

                                    {image && <span title={image.name}>{image.name}</span>}
                                </div>
                                
                                <div className="image-div">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="imagem" title="Imagem escolhida"/>
                                    )}
                                    
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" className="submit">Adicionar Categoria</button>

                    </form>
                </div>
            )}
        </>
    )
}

export default CategorySettings