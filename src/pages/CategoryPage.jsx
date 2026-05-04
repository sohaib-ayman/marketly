import { useContext } from "react";
import { useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";

function CategoryPage() {

    const { categoryName } = useParams();

    const { products } = useContext(DataContext);

    const categoryProducts = products.filter(
        item => item.category === categoryName
    );

    return (
        <div>
            <h1>{categoryName}</h1>

            {categoryProducts.map(product => (
                <div key={product.id}>
                    <h3>{product.title}</h3>
                    <p>{product.price}</p>
                    <button>Add To Cart</button>
                </div>
            ))}

        </div>
    )

}

export default CategoryPage;