const BASE_URL = 'http://localhost:3000/products'; // Nova URL base
const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');

// Function to fetch all products from the server
async function fetchProducts() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`Error fetching products: ${response.statusText}`);
    const products = await response.json();

    // Clear product list
    productList.innerHTML = '';

    // Add each product to the list
    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${product.name}</strong> - $${product.price}<br>
        <em>${product.description}</em>
      `;

      // Add delete button for each product
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await deleteProduct(product.id);
        await fetchProducts();
      });
      li.appendChild(deleteButton);

      // Add update button for each product
      const updateButton = document.createElement('button');
      updateButton.innerHTML = 'Update';
      updateButton.addEventListener('click', async () => {
        const newName = prompt(`Enter new name for "${product.name}"`, product.name);
        const newPrice = prompt(`Enter new price for "${product.name}"`, product.price);
        const newDescription = prompt(`Enter new description for "${product.name}"`, product.description);

        // If the user provided all fields, update the product
        if (newName !== null && newPrice !== null && newDescription !== null) {
          await updateProduct(product.id, newName, parseFloat(newPrice), newDescription);
          await fetchProducts();
        }
      });
      li.appendChild(updateButton);

      productList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    alert('Failed to fetch products. Please check the console for details.');
  }
}

// Function to add a new product
async function addProduct(name, price, description) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, description })
    });
    if (!response.ok) throw new Error(`Failed to add product: ${response.statusText}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    alert('Failed to add product.');
  }
}

// Function to delete a product
async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`Failed to delete product: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error(error);
    alert('Failed to delete product.');
  }
}

// Function to update a product
async function updateProduct(id, name, price, description) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, description })
    });
    if (!response.ok) throw new Error(`Failed to update product: ${response.statusText}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    alert('Failed to update product.');
  }
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;

  if (name && price && description) {
    await addProduct(name, parseFloat(price), description);
    addProductForm.reset();
    await fetchProducts();
  } else {
    alert('Please fill out all fields.');
  }
});

// Fetch all products on page load
fetchProducts();
