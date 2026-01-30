import { useEffect, useState } from "react";
import "../styles/Settings.css"
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import type { productDTO } from "../dto/productDTO";
import type { CategoryDTO } from "../dto/categoryDTO";

type mode = "nameAsc" | "nameDesc"

const ProductSettings: React.FC = () => {

    const [showMode, setShowMode] = useState<mode>("nameAsc");
    const { addToastNotification: addNotification } = useToastNotification();
    const [loadingBot, setLoadingBot] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [reload, setReload] = useState(false);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [products, setProducts] = useState<productDTO[]>([]);
    const [showProducts, setShowProducts] = useState<productDTO[]>([]);

    const [updateModal, setUpdateModal] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const [productSelected, setProductSelected] = useState(0);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0.0);
    const [image, setImage] = useState<File | null>(null);
    const [categoryId, setCategoryId] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [active, setActive] = useState(true);

    const [imageToShow, setImageToShow] = useState("");
    const [categoryToShow, setCategoryToShow] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImage(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const refreshProducts = () => {
        setReload(prev => !prev);
    };

    const resetInputValues = () => {
        setName("");
        setDescription("");
        setPrice(0.0);
        setImage(null);
        setCategoryId(0);
        setDiscount(0);
        setImageToShow("");
        setCategoryToShow("");
        setProductSelected(0);
        setImagePreview("");
    }

    const setInputValues = (product: productDTO) => {
        resetInputValues();

        setProductSelected(product.id);
        setDescription(product.description);
        setPrice(product.price);
        setImageToShow(product.image);
        setDiscount(product.discount);
        setCategoryToShow(product.categoryName);
    }

    useEffect (() => {
        const setCategoryInfo = () => {
            if (categoryToShow.length > 0) {
                const categorySelected = categories.find(c => c.name === categoryToShow);

                if (!categorySelected) return;

                setCategoryId(categorySelected.id);
            }
        }

        setCategoryInfo();
    }, [categoryToShow]);

    

    const addProduct = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        
        formData.append("name", name);
        formData.append("price", price.toString());
        formData.append("categoryId", categoryId.toString());
        formData.append("discount", discount.toString());
        formData.append("active", active.toString());

        if(description) {
            formData.append("description", description);
        }

        if(image) {
            formData.append("image", image);
        }
        
        try {
            setLoadingBot(true);
            await api.post(`/product/add`, formData);
            refreshProducts();
            setAddModal(false);
            addNotification("O Produto foi adicionado.", false);
            
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

    const updateProduct = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        
        formData.append("price", price.toString());
        formData.append("categoryId", categoryId.toString());
        formData.append("discount", discount.toString());
        
        if(image) {
            formData.append("image", image);
        }

        if(description) {
            formData.append("description", description);
        }
        
        if(productSelected > 0) {
            try {
                setLoadingBot(true);
                await api.put(`/product/update/${productSelected}`, formData);
                refreshProducts();
                setUpdateModal(false);
                addNotification("O Produto foi atualizado.", false);
                
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

    const toggleActive = async (id: number) => {
        setProducts(prev =>
            prev.map(product =>
                product.id === id
                    ? { ...product, active: !product.active }
                    : product
            )
        );
                
        try {
                
            await api.put(`/product/change-state/${id}`);
            refreshProducts();
            setUpdateModal(false);
            addNotification("O estado do Produto foi atualizado.", false);
                
        } catch (err:any) {
            setProducts(prev =>
                prev.map(product =>
                    product.id === id
                        ? { ...product, active: !product.active }
                        : product
                )
            );

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

    useEffect (() => {
        const getProducts = async () => {
            try {
                const response = await api.get(`/product/search`);
                setProducts(response.data);
                
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
                setLoadingProducts(false);
            }
        };

        getProducts();
    }, [reload]);

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
            }
        };

        getCategory();
    }, []);

    const changeShowMode = () => {
         
        if (showMode === "nameAsc") {
            setShowMode("nameDesc");
        } else {
            setShowMode("nameAsc");
        }
    }

    const sortByNameDesc = (arr: typeof products) =>
        [...arr].sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowProducts(products);

        } else if (showMode === "nameDesc") {
            setShowProducts(sortByNameDesc(products));

        }

    }, [showMode, products]);

    return (
        <>
            <div className="show-setting">
                <div className="header">
                    <h2>Gestão de Produtos</h2>
                    <button onClick={() => { resetInputValues(); setAddModal(true) }}><FaPlus /></button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="name" onClick={() => changeShowMode()}>
                                Pastelaria {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="button-container">
                                Ativar
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

                            {loadingProducts ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {showProducts.length === 0 ? (
                                        <tr>
                                            <td className="name">Não existem Produtos para mostrar.</td>
                                        </tr>
                                    ) : (
                                        showProducts.map(product => (
                                            
                                            <tr key={product.id}>
                                                <td className="name" title={product.name}>{product.name}</td>
                                                <td className="button-container">
                                                    <label className="switch">
                                                        <input
                                                            type="checkbox"
                                                            checked={product.active}
                                                            onChange={() => toggleActive(product.id)}
                                                        />
                                                        <span className="slider" />
                                                    </label>
                                                </td>
                                                <td className="button-container">
                                                    <button className="edit" onClick={() => {setInputValues(product); setUpdateModal(true)} }><FaPencilAlt /></button>
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
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={updateProduct}>
                        <button type="button" onClick={() => setUpdateModal(false)}><RxCross2 /></button>

                        <h4 className="first">Descrição</h4>
                        <textarea
                            placeholder='Insira uma descrição do produto (opcional)...'
                            className="notes-box"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="inline-normal">
                            <div className="left-setting">
                                <h4>Preço(€) (*)</h4>
                                <input
                                    type="number"
                                    id="price"
                                    min="0"
                                    step="0.01"
                                    placeholder='Insira o preço do produto...'
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="right-setting">
                                <h4>Desconto(%) (*)</h4>
                                <input
                                    type="number"
                                    id="discount"
                                    min="0"
                                    placeholder='Insira o desconto do produto...'
                                    value={discount}
                                    onChange={(e) => setDiscount(Number(e.target.value))}
                                    required
                                />
                            </div>
                        </div>
                        
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
                                    <img src={imagePreview ? (imagePreview) : (imageToShow)} alt="imagem" title={imagePreview ? "Imagem escolhida" : "Imagem atual"}/>
                                </div>
                            </div>
                        </div>

                        <h4>Categoria (*)</h4>
                        <select
                            id="category"
                            value={categoryToShow}
                            onChange={(e) => setCategoryToShow(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Selecione uma categoria...
                            </option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className="submit">{loadingBot ? (<div className="spinner"></div>) : (<>Atualizar Produto</>)}</button>
                    </form>
                </div>
            )}
            
            {addModal && (
                <div onClick={() => setAddModal(false)} className="back-modal">
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={addProduct}>
                        <button type="button" onClick={() => setAddModal(false)}><RxCross2 /></button>

                        <h4 className="first">Nome (*)</h4>
                        <input
                            type="text"
                            id="name"
                            placeholder='Insira o nome do produto...'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <h4>Descrição</h4>
                        <textarea
                            placeholder='Insira uma descrição do produto (opcional)...'
                            className="notes-box"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="inline-normal">
                            <div className="left-setting">
                               <h4>Preço(€) (*)</h4>
                                <input
                                    type="number"
                                    id="price"
                                    min="0"
                                    step="0.01"
                                    placeholder='Insira o preço do produto...'
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    required
                                /> 
                            </div>
                            <div className="right-setting">
                                <h4>Desconto(%) (*)</h4>
                                <input
                                    type="number"
                                    id="discount"
                                    min="0"
                                    placeholder='Insira o desconto do produto...'
                                    value={discount}
                                    onChange={(e) => setDiscount(Number(e.target.value))}
                                    required
                                />
                            </div>
                        </div>

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

                        <h4>Categoria (*)</h4>
                        <select
                            id="category"
                            value={categoryToShow}
                            onChange={(e) => setCategoryToShow(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Selecione uma categoria...
                            </option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <div className="inline-normal">
                            
                            <div className="left-setting">
                                <h4>Ativo (*)</h4>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={active}
                                        onChange={(e) => setActive(e.target.checked)}
                                    />
                                    <span className="slider" />
                                </label>
                            </div>
                            

                            
                        </div>
                        
                        <button type="submit" className="submit">{loadingBot ? (<div className="spinner"></div>) : (<>Adicionar Produto</>)}</button>
                    </form>
                </div>
            )}
        </>
    )
}

export default ProductSettings