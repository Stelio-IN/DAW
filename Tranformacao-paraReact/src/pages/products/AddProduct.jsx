import * as Icons from "react-icons/tb";
import Tags from "../../api/Tags.json";
import Taxes from "../../api/Taxes.json";
import Labels from "../../api/Labels.json";
import Products from "../../api/Products.json";
import React, { useState, useEffect } from "react";
import Variations from "../../api/Variations.json";
import Colloctions from "../../api/Colloctions.json";
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import Tagify from "../../components/common/Tagify.jsx";
import Button from "../../components/common/Button.jsx";
import Attributes from "../../api/ProductAttributes.json";
import Divider from "../../components/common/Divider.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Accordion from "../../components/common/Accordion.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";

const AddProduct = ({ productData }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    sku: "",
    priceSale: "",
    price: "",
    costPerItem: "",
    profit: "",
    margin: "",
    barcode: "",
    quantity: "",
    question: "",
    answer: "",
    metaLink: "http://localhost:5173/catalog/product",
    metaTitle: "",
    metaDescription: "",
  });

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
    stockValue: "",
    attribute: "",
    attributeValue: "",
  });

  const handleInputChange = (key, value) => {
    setProduct({
      ...product,
      [key]: value,
    });
  };

  useEffect(() => {
    const profit = product.price - product.costPerItem;
    const margin = profit / product.price * 100;
    setProduct({
      ...product,
      profit: profit,
      margin: margin ? margin : '',
    });
  }, [product.price,product.costPerItem])

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

  const uniqueCategories = [...new Set(Products.map(product => product.category))];

  const category = uniqueCategories.map(category => ({
    label: category
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

  const actionItems = ["Delete", "View"];

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase();
    if (updateItem === "delete") {
      alert(`#${itemID} item delete`);
    } else if (updateItem === "view") {
      setIsOffcanvasOpen(true);
    }
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
          <h2 className="sub_heading">Imagens do Produto</h2>
          <FileUpload/>
        </div>
        <div className="content_item">
          <h2 className="sub_heading">Preços</h2>
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
              placeholder="Digite o preço de venda do produto"
              icon={<Icons.TbCoin />}
              label="Preço de Venda"
              value={product.priceSale}
              onChange={(value) => handleInputChange("priceSale", value)}
            />
          </div>
          <div className="column_3">
            <Input
              type="number"
              icon={<Icons.TbCoin />}
              placeholder="Custo por Item"
              label="Custo por Item"
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
        <div className="content_item">
          <h2 className="sub_heading">
            <span>Variações</span>
            <Button
              label="Adicionar Variação"
              icon={<Icons.TbPlus />}
              onClick={openModal}
              className="sm"
            />
          </h2>

          <table className="bordered">
            <thead>
              <tr>
                <th>Variação</th>
                {Attributes.map((attribute, key) => (
                  <th key={key}>{attribute.name}</th>
                ))}
                <th>Preço</th>
                <th colSpan="2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {Variations.map((variation, key) => (
                <tr key={key}>
                  <td>{getAttributesString(variation.attributes)}</td>
                  {Attributes.map((attribute) => (
                    <td key={attribute.id}>
                      {variation.attributes[attribute.name]
                        ? variation.attributes[attribute.name]
                        : "-"}
                    </td>
                  ))}
                  <td>R${variation.price.toFixed(2)}</td>
                  <td className="td_action">
                    <TableAction
                      actionItems={actionItems}
                      onActionItemClick={(item) =>
                        handleActionItemClick(item, product.id)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="content_item">
          <h2 className="sub_heading">Adicionar Pergunta</h2>
          <div className="column">
            <Input
              type="text"
              placeholder="Digite a pergunta"
              icon={<Icons.TbQuestionMark />}
              label="Pergunta"
              value={product.question}
              onChange={(value) => handleInputChange("question", value)}
            />
          </div>
          <div className="column">
            <Textarea
              type="text"
              placeholder="Digite a resposta"
              icon={<Icons.TbCircleCheck />}
              label="Resposta"
              value={product.answer}
              onChange={(value) => handleInputChange("answer", value)}
            />
          </div>

          <Button
            label="Adicionar Pergunta"
            icon={<Icons.TbCheck />}
            className="sm right"
            onClick={handleFaqQuestion}
          />
        </div>
        {faqs.length !== 0 ? (
          <div className="content_item">
            <h2 className="sub_heading">FAQ's</h2>
            {faqs.map((faq, key) => {
              return (
                <div className="column" key={key}>
                  <Accordion title={faq.question}>
                    <p>{faq.answer}</p>
                  </Accordion>
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
        <div className="content_item meta_data">
          <div className="column">
            <span>Listagem em motores de busca</span>
            <h2 className="meta_title">{product.metaTitle || product.name}</h2>
            <p className="meta_link">{product.metaLink}</p>
            <p className="meta_description">{product.metaDescription || product.description}</p>
          </div>
          <div className="column">
            <Input
              type="text"
              placeholder="Digite o título meta"
              label="Título"
              value={product.metaTitle || product.name}
              onChange={(value) => handleInputChange("metaTitle", value)}
            />
          </div>
          <div className="column">
            <Input
              type="text"
              placeholder="Digite o link meta"
              label="Link"
              value={`${product.metaLink}/${product.metaTitle || product.name}`}
              onChange={(value) => handleInputChange("metaLink", value)}
            />
          </div>
          <div className="column">
            <Textarea
              type="text"
              placeholder="Digite a descrição meta"
              label="Descrição"
              value={product.metaDescription || product.description}
              onChange={(value) => handleInputChange("metaDescription", value)}
            />
          </div>
        </div>
      </div>
      <div className="sidebar">
        <div className="sidebar_item">
          <h2 className="sub_heading">Publicar</h2>
          <Button
            label="Salvar e sair"
            icon={<Icons.TbDeviceFloppy />}
          />
          <Button
            label="Salvar"
            icon={<Icons.TbCircleCheck />}
            className="success"
          />
        </div>
        <div className="sidebar_item">
          <h2 className="sub_heading">Status do Estoque</h2>
          <div className="column">
            <Dropdown
              placeholder="Selecione o status do estoque"
              selectedValue={selectedValue.stockValue}
              onClick={handleStockSelect}
              options={selectOptions}
              className="sm"
            />
          </div>
        </div>
        <div className="sidebar_item">
          <h2 className="sub_heading">Categorias</h2>
          <MultiSelect
            className="sm"
            isMulti={true}
            options={category}
            placeholder="Selecione as opções..."
          />
        </div>
        <div className="sidebar_item">
          <h2 className="sub_heading">Quantidade</h2>
          <div className="column">
            <Input
              type="number"
              placeholder="Digite a quantidade do produto"
              value={product.quantity}
              onChange={(value) => handleInputChange("quantity", value)}
              className="sm"
            />
          </div>
        </div>
        <div className="sidebar_item">
          <h2 className="sub_heading">Impostos</h2>
          <div className="sidebar_checkboxes">
            {taxes.map((tax) => (
              <CheckBox
                key={tax.id}
                id={tax.id}
                label={`${tax.name} ${tax.percentage}`}
                isChecked={tax.isChecked}
                onChange={(isChecked) => handleCheckTax(tax.id, isChecked)}
              />
            ))}
          </div>
        </div>
        <div className="sidebar_item">
          <h2 className="sub_heading">Coleções de Produto</h2>
          <div className="sidebar_checkboxes">
            {colloctions.map((collection) => (
              <CheckBox
                key={collection.id}
                id={collection.id}
                label={`${collection.name}`}
                isChecked={collection.isChecked}
                onChange={(isChecked) =>
                  handleCheckCollection(collection.id, isChecked)
                }
              />
            ))}
          </div>
        </div>
        <div className="sidebar_item">
          <h2 className="sub_heading">Rótulos</h2>
          <div className="sidebar_checkboxes">
            {labels.map((label) => (
              <CheckBox
                key={label.id}
                id={label.id}
                label={`${label.name}`}
                isChecked={label.isChecked}
                onChange={(isChecked) => handleCheckLabel(label.id, isChecked)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
};

export default AddProduct;
