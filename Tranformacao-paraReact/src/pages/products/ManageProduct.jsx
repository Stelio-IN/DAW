import * as Icons from "react-icons/tb";
import Products from "../../api/Products.json";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import RangeSlider from "../../components/common/RangeSlider.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";

const ManageProduct = () => {
  const [fields, setFields] = useState({
    name: "",
    sku: "",
    store: "",
    status: "",
    priceRange: [0, 100],
  });
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [tableRow, setTableRow] = useState([
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ]);
  const handleInputChange = (key, value) => {
    setFields({
      ...product,
      [key]: value,
    });
  };
  const products = Products;

  const bulkAction = [
    { value: "delete", label: "Excluir" },
    { value: "category", label: "Categoria" },
    { value: "status", label: "Status" },
  ];

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      products.forEach((product) => {
        updateChecks[product.id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckProduct = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const showTableRow = (selectedOption) => {
    setSelectedValue(selectedOption.label);
  };

  const actionItems = ["Excluir", "Editar"];

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase();
    if (updateItem === "excluir") {
      alert(`#${itemID} item excluído`);
    } else if (updateItem === "editar") {
      navigate(`/catalog/product/manage/${itemID}`);
    }
  };

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleToggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  const handleCloseOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  const handleSliderChange = (newValues) => {
    setFields({
      ...fields,
      priceRange: newValues,
    });
  };

  const stores = [
    { label: "FashionFiesta" },
    { label: "TechTreasures" },
    { label: "GadgetGrove" },
    { label: "HomeHarbor" },
    { label: "HealthHaven" },
    { label: "BeautyBoutique" },
    { label: "Haven dos Livros" },
    { label: "Paraíso dos Pets" },
    { label: "Descobertas Culinárias" },
  ];
  const status = [
    { label: "Em Estoque" },
    { label: "Fora de Estoque" },
    { label: "Disponível em Breve" },
    { label: "Sob Encomenda" },
    { label: "Recondicionado" },
    { label: "Em Promoção" },
    { label: "Estoque Limitado" },
    { label: "Descontinuado" },
    { label: "Em Breve" },
    { label: "Novo Lançamento" },
    { label: "Pré-venda" },
  ];
  const handleSelectStore = (selectedValues) => {
    setFields({
      ...fields,
      store: selectedValues,
    });
  };

  const handleSelectStatus = (selectedValues) => {
    setFields({
      ...fields,
      status: selectedValues.label,
    });
  };

  return (
    <section className="products">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head">
              <Dropdown
                placeholder="Ação em Massa"
                className="sm"
                onClick={bulkActionDropDown}
                options={bulkAction}
              />
              <Button
                label="Filtro Avançado"
                className="sm"
                icon={<Icons.TbFilter />}
                onClick={handleToggleOffcanvas}
              />
              <Input
                placeholder="Buscar Produto..."
                className="sm table_search"
              />
              <Offcanvas isOpen={isOffcanvasOpen} onClose={handleCloseOffcanvas}>
                <div className="offcanvas-head">
                  <h2>Busca Avançada</h2>
                </div>
                <div className="offcanvas-body">
                  <div className="column">
                    <Input
                      type="text"
                      placeholder="Digite o nome do produto"
                      label="Nome"
                      value={fields.name}
                      onChange={(value) => handleInputChange("name", value)}
                    />
                  </div>
                  <div className="column">
                    <Input
                      type="text"
                      label="Preço"
                      value={fields.price}
                      placeholder="Digite o preço do produto"
                      onChange={(value) => handleInputChange("price", value)}
                    />
                  </div>
                  <div className="column">
                    <MultiSelect
                      options={stores}
                      placeholder="Selecione a Loja"
                      label="Loja"
                      isSelected={fields.store}
                      onChange={handleSelectStore}
                    />
                  </div>
                  <div className="column">
                    <Dropdown
                      options={status}
                      placeholder="Selecione o Status"
                      label="Status"
                      selectedValue={fields.status}
                      onClick={handleSelectStatus}
                    />
                  </div>
                  <div className="column">
                    <RangeSlider
                      label="Faixa de Preço"
                      values={fields.priceRange}
                      onValuesChange={handleSliderChange}
                    />
                  </div>
                </div>
                <div className="offcanvas-footer">
                  <Button
                    label="Descartar"
                    className="sm outline"
                    icon={<Icons.TbX />}
                    onClick={handleCloseOffcanvas}
                  />
                  <Button
                    label="Filtrar"
                    className="sm"
                    icon={<Icons.TbFilter />}
                    onClick={handleCloseOffcanvas}
                  />
                </div>
              </Offcanvas>
              <div className="btn_parent">
                <Link to="/catalog/product/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Criar Produto</span>
                </Link>
                <Button label="Recarregar" icon={<Icons.TbRefresh />} className="sm" />
              </div>
            </div>
            <div className="content_body">
              <div className="table_responsive">
                <table className="separate">
                  <thead>
                    <tr>
                      <th className="td_checkbox">
                        <CheckBox onChange={handleBulkCheckbox} isChecked={bulkCheck} />
                      </th>
                      <th className="td_id">ID</th>
                      <th className="td_image">Imagem</th>
                      <th colSpan="4">Nome</th>
                      <th>Preço</th>
                      <th>Loja</th>
                      <th>SKU</th>
                      <th>Criado em</th>
                      <th className="td_status">Avaliação</th>
                      <th className="td_status">Status Estoque</th>
                      <th className="td_action">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, key) => {
                      return (
                        <tr key={key}>
                          <td className="td_checkbox">
                            <CheckBox
                              onChange={(isCheck) => handleCheckProduct(isCheck, product.id)}
                              isChecked={specificChecks[product.id] || false}
                            />
                          </td>
                          <td className="td_id">{product.id}</td>
                          <td className="td_image">
                            <img src={product.images.thumbnail} alt={product.name} />
                          </td>
                          <td colSpan="4">
                            <Link to={product.id}>{product.name}</Link>
                          </td>
                          <td>
                            {`${product.price} `}
                            <b>{product.currency}</b>
                          </td>
                          <td>
                            <Link>{product.brand}</Link>
                          </td>
                          <td>{product.sku}</td>
                          <td>{product.availability_dates.start_date}</td>
                          <td className="td_status">
                            {product.ratings.average_rating}
                          </td>
                          <td className="td_status">
                            {product.inventory.in_stock ? (
                              <Badge
                                label="Em Estoque"
                                className="light-success"
                              />
                            ) : product.inventory.quantity < 10 &&
                              product.inventory.quantity > 0 ? (
                              <Badge
                                label="Estoque Baixo"
                                className="light-warning"
                              />
                            ) : (
                              <Badge
                                label="Fora de Estoque"
                                className="light-danger"
                              />
                            )}
                          </td>
                          <td className="td_action">
                            <TableAction
                              actionItems={actionItems}
                              onActionItemClick={(item) =>
                                handleActionItemClick(item, product.id)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="content_footer">
              <Dropdown
                className="top show_rows sm"
                placeholder="Selecione"
                selectedValue={selectedValue}
                onClick={showTableRow}
                options={tableRow}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageProduct;

