import * as Icons from "react-icons/tb";
import Tags from "../../api/Tags.json";
import Taxes from "../../api/Taxes.json";
import Labels from "../../api/Labels.json";
import Products from "../../api/Products.json";
import Categories from "../../api/Categories.json";
import React, { useState, useEffect } from "react";
import Variations from "../../api/Variations.json";
import Colloctions from "../../api/Colloctions.json";
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import NotFound from '../../pages/error/NotFound.jsx';
import Tagify from "../../components/common/Tagify.jsx";
import Button from "../../components/common/Button.jsx";
import Attributes from "../../api/ProductAttributes.json";
import Divider from "../../components/common/Divider.jsx";
import { useParams, Routes, Route} from "react-router-dom";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Accordion from "../../components/common/Accordion.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";
import ManageProduct from "../../pages/products/ManageProduct.jsx";

const EditProduct = ({ productData }) => {
  const {productId} = useParams();
  const getProduct = Products.find(product=> product.id.toString() === productId.toString());
  if (!getProduct) {
    return <Routes>
      <Route path="*" element={<NotFound title="product not found" message="Sorry, the product details you are looking for could not be found."/>}/>
    </Routes>
  }

  const [product, setProduct] = useState({
    name: getProduct.name,
    description: getProduct.description,
    sku: getProduct.sku,
    priceSale: getProduct.salePrice,
    price: getProduct.price,
    costPerItem: getProduct.costPerItem,
    profit: "",
    margin: "",
    barcode: "",
    quantity: getProduct.inventory.quantity,
    question: "",
    answer: "",
    metaLink: "http://localhost:5173/catalog/product",
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    const profit = product.price - product.costPerItem;
    const margin = profit / product.price * 100;
    setProduct({
      ...product,
      profit: profit,
      margin: margin ? margin : '',
    });
  }, [product.price,product.costPerItem,setProduct])

  const [selectOptions, setSelectOptions] = useState([
    {
      value: "success",
      label: "in stock",
    },
    {
      value: "danger",
      label: "out of stock",
    },
    {
      value: "warning",
      label: "On backorder",
    },
  ]);

  const [selectedValue, setSelectedValue] = useState({
    stockValue: getProduct.inventory.in_stock ? "in stock" : "out of stock",
    attribute: "",
    attributeValue: "",
    categoriesValue: getProduct.category,
  });

  const handleInputChange = (key, value) => {
    setProduct({
      ...product,
      [key]: value,
    });
    // setProduct({
    //   ...product,
    // });
  };


  const handleStockSelect = (selectedOption) => {
    setSelectedValue({
      ...selectedValue,
      stockValue: selectedOption.label,
    });
  };

  const attributes = Attributes.map((attribute) => ({
    label: attribute.name,
    value: attribute.name,
  }));

  const [attributeOption, setAttributeOption] = useState(attributes);

  const handleAttributeSelect = (selectedOption) => {
    setSelectedValue({
      ...selectedValue,
      attribute: selectedOption.label,
    });
  };

  const [faqs, setFaqs] = useState([]);

  const handleFaqQuestion = (e) => {
    e.preventDefault();
    if (product.question && product.answer) {
      setFaqs([
        ...faqs,
        {
          question: product.question,
          answer: product.answer,
        },
      ]);
      setProduct({
        ...product,
        question: "",
        answer: "",
      });
    }
  };


  const category = Categories.map(category => ({
    label: category.name
  }));

  const [tags, setTags] = useState(Tags);
  const [taxes, setTaxes] = useState(Taxes);
  const [colloctions, setColloctions] = useState(Colloctions);
  const [labels, setLabels] = useState(Labels);

  const handleCheckTax = (id, checked) => {
    setTaxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, isChecked: checked } : checkbox
      )
    );
  };
  const handleCheckCollection = (id, checked) => {
    setColloctions((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, isChecked: checked } : checkbox
      )
    );
  };
  const handleCheckLabels = (id, checked) => {
    setLabels((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, isChecked: checked } : checkbox
      )
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getAttributesString = (attributes) => {
    const availableAttributes = Object.values(attributes).filter(value => value);
    return availableAttributes.join(' / ');
  };

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleOpenOffcanvas = () => {
    setIsOffcanvasOpen(true);
  };

  const handleCloseOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  return (
    <section>
    <div className="container">
      <div className="wrapper">
        <div className="content">
          <div className="content_item">
            <h2 className="sub_heading">Informações do Produto</h2>
            <div className="column">
              <Input
                type="text"
                placeholder="Digite o nome do produto"
                label="Nome"
                icon={<Icons.TbShoppingCart />}
                value={product.name}
                onChange={(value) => handleInputChange("name", value)}
              />
            </div>
            <div className="column">
              <TextEditor
                label="Descrição"
                placeholder="Digite uma descrição"
                value={product.description}
                onChange={(value) => handleInputChange("description", value)}
              />
            </div>
          </div>
          <div className="content_item">
            <FileUpload />
          </div>
          <div className="content_item">
            <h2 className="sub_heading">Preço</h2>
            <div className="column_2">
              <Input
                type="number"
                placeholder="Digite o preço do produto"
                icon={<Icons.TbCoin />}
                label="Preço"
                value={product.price}
                onChange={(value) => handleInputChange("price", value)}
              />
            </div>
            <div className="column_2">
              <Input
                type="number"
                placeholder="Digite o preço promocional do produto"
                icon={<Icons.TbCoin />}
                label="Preço Promocional"
                value={product.priceSale}
                onChange={(value) => handleInputChange("priceSale", value)}
              />
            </div>
            <div className="column_3">
              <Input
                type="number"
                icon={<Icons.TbCoin />}
                placeholder="Custo por Unidade"
                label="Custo por Unidade"
                value={product.costPerItem}
                onChange={(value) => handleInputChange("costPerItem", value)}
              />
            </div>
            <div className="column_3">
              <Input
                type="number"
                placeholder="- -"
                label="Lucro"
                readOnly={true}
                value={product.profit}
              />
            </div>
            <div className="column_3">
              <Input
                type="text"
                placeholder="- -"
                label="Margem"
                readOnly={true}
                value={`${product.margin ? product.margin.toFixed(2) : "- -"}%`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default EditProduct;
