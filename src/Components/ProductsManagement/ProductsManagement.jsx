import React, { useContext, useMemo, useState } from "react";
import Style from "./ProductsManagement.module.css";
import { DataContext } from "../../Context/DataContext";

const emptyForm = {
    title: "",
    price: 0,
    category: "",
    thumbnail: "",
    description: "",
};

export default function ProductsManagement() {
    let { products, setProducts, categories } = useContext(DataContext);
    let [search, setSearch] = useState("");
    let [showAddForm, setShowAddForm] = useState(false);
    let [editingProduct, setEditingProduct] = useState(null);
    let [productToDelete, setProductToDelete] = useState(null);
    let [formData, setFormData] = useState(emptyForm);

    let filteredProducts = useMemo(() => {
        return products
            .map(p => formatProduct(p))
            .filter(product =>
                product.title.toLowerCase().includes(search.toLowerCase())
            );
    }, [products, search]);

    function formatProduct(product) {
        return {
            id: product.id || Date.now(),

            title: product.title || "",
            description: product.description || "",
            category: product.category || "",

            price: product.price || 0,

            thumbnail: product.thumbnail || "",
            images: product.images?.length
                ? product.images
                : [product.thumbnail],

            rating: product.rating || 0,
            stock: product.stock || 0,
        };
    }

    function handleChange(e) {
        let { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    }

    function handleAddSubmit(e) {
        e.preventDefault();

        const newProduct = formatProduct(formData);

        setProducts(prev => [newProduct, ...prev]);

        setFormData(emptyForm);
        setShowAddForm(false);
    }

function openEdit(product) {
    setEditingProduct(product);
    setFormData({
        title: product.title,
        price: product.price,
        category: product.category,
        thumbnail: product.thumbnail,
        description: product.description,
    });
}

function handleEditSubmit(e) {
    e.preventDefault();

    setProducts(prev =>
        prev.map(product => product.id === editingProduct.id ? { ...product, ...formData } : product)
    );

    setEditingProduct(null);
    setFormData(emptyForm);
}

function confirmDelete() {
    setProducts(prev =>
        prev.filter(product => product.id !== productToDelete.id)
    );

    setProductToDelete(null);
}

return <>
    {!showAddForm && (<button className={`${Style.addBtn} mb-4`} onClick={() => setShowAddForm(true)}><span><i className="fa-solid fa-plus"></i></span> Add New Product</button>)}

    {showAddForm && (
        <>
            <button type="button" className={`${Style.cancelTopBtn} mb-4`} onClick={() => {
                setShowAddForm(false);
                setFormData(emptyForm);
            }}><span><i className="fa-solid fa-x"></i></span> Cancel</button>

            <form className={Style.addForm} onSubmit={handleAddSubmit}>

                <h3>Add New Product</h3>
                <div className={Style.formGrid}>
                    <input name="title" placeholder="Product Name" value={formData.title} onChange={handleChange} required />
                    <input name="price" type="number" value={formData.price} onChange={handleChange} required />

                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>

                    <input name="thumbnail" placeholder="Image URL" value={formData.thumbnail} onChange={handleChange} required />
                </div>

                <textarea name="description" rows="5" placeholder="Description" value={formData.description} onChange={handleChange} required />

                <button className={`${Style.submitBtn} mt-3`}>Add Product</button>
            </form>
        </>
    )}

    <div className={Style.panel}>
        <input className={Style.searchInput} placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className={Style.tableWrapper}>
            <table className={Style.table}>
                <thead>
                    <tr>
                        <th>PRODUCT</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product.id}>
                            <td className="py-2">
                                <div className={Style.productCell}>
                                    <img src={product.thumbnail} alt={product.title} onError={(e) => {
                                        e.target.src = "/placeholder-product.png";
                                    }} />
                                    <span>{product.title}</span>
                                </div>
                            </td>

                            <td className="text-secondary">{product.category}</td>
                            <td className="py-2">${product.price}</td>

                            <td className="py-2">
                                <button className={`${Style.editBtn} ps-0`} onClick={() => openEdit(product)}><i className="fa-regular fa-pen-to-square"></i> Edit</button>
                                <button className={`${Style.deleteBtn} ps-0`} onClick={() => setProductToDelete(product)}><i className="fa-regular fa-trash-can"></i> Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>

    {editingProduct && (
        <div className={Style.modalOverlay} onClick={() => setEditingProduct(null)}>
            <form className={Style.modal} onSubmit={handleEditSubmit} onClick={(e) => e.stopPropagation()}>
                <div className={Style.modalHeader}>
                    <h3>Edit Product</h3>
                    <button type="button" className={Style.closeBtn} onClick={() => setEditingProduct(null)}><i className="fa-solid fa-x"></i></button>
                </div>

                <div className={Style.modalBody}>
                    <div className={Style.modalGrid}>
                        <input name="title" value={formData.title} onChange={handleChange} required />
                        <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} required />
                        <select name="category" value={formData.category} onChange={handleChange} required>{categories.map(cat => (
                            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                        </select>
                        <input name="thumbnail" value={formData.thumbnail} onChange={handleChange} required />
                    </div>

                    <textarea name="description" rows="5" value={formData.description} onChange={handleChange} required />
                </div>

                <div className={Style.modalFooter}>
                    <button type="button" className={Style.cancelBtn} onClick={() => setEditingProduct(null)}>Cancel</button>
                    <button className={Style.submitBtn}>Save Changes</button>
                </div>
            </form>
        </div>
    )}

    {productToDelete && (
        <div className={Style.modalOverlay} onClick={() => setProductToDelete(null)}>
            <div className={Style.modal} onClick={(e) => e.stopPropagation()}>
                <div className={Style.modalHeader}>
                    <h3>Delete Product</h3>
                </div>

                <div className={Style.modalBody}>
                    <p>Are you sure you want to delete <strong>{productToDelete.title}</strong>?</p>
                </div>

                <div className={Style.modalFooter}>
                    <button className={Style.cancelBtn} onClick={() => setProductToDelete(null)}>Cancel</button>
                    <button className={Style.confirmDelete} onClick={confirmDelete}>Delete</button>
                </div>
            </div>
        </div>
    )}
</>
}