import React from "react";
import * as Icons from "react-icons/tb";

const navigation = [
  {
    name: "Painel de Controle",
    url: "/",
    icon: <Icons.TbLayout className="menu_icon" />,
  },
  {
    name: "Catálogo",
    icon: <Icons.TbBuildingWarehouse className="menu_icon" />,
    url: "/catalog",
    subMenu: [
      {
        name: "Produtos",
        url: "/product/manage",
        icon: <Icons.TbGardenCart className="menu_icon" />,
      },
      {
        name: "Adicionar Produto",
        url: "/product/add",
        icon: <Icons.TbCirclePlus className="menu_icon" />,
      },
      {
        name: "Categorias",
        url: "/categories/manage",
        icon: <Icons.TbCategory className="menu_icon" />,
      },
      {
        name: "Atributos",
        url: "/product/attribute",
        icon: <Icons.TbCalendar className="menu_icon" />,
      },
    ],
  },
  {
    name: "Pedidos",
    url: "/orders",
    icon: <Icons.TbChecklist className="menu_icon" />,
    subMenu: [
      {
        name: "Gerenciar Pedido",
        url: "/manage",
        icon: <Icons.TbList className="menu_icon" />,
      },
      {
        name: "Adicionar Pedido",
        url: "/add",
        icon: <Icons.TbCirclePlus className="menu_icon" />,
      },
    ],
  },
  {
    name: "Clientes",
    url: "/customers",
    icon: <Icons.TbUsers className="menu_icon" />,
    subMenu: [
      {
        name: "Gerenciar Clientes",
        url: "/manage",
        icon: <Icons.TbList className="menu_icon" />,
      },
      {
        name: "Adicionar Clientes",
        url: "/add",
        icon: <Icons.TbCirclePlus className="menu_icon" />,
      },
    ],
  },
  {
    name: "Avaliações",
    url: "/reviews",
    icon: <Icons.TbStar className="menu_icon" />,
  },
  {
    name: "Marcas",
    url: "/brands",
    icon: <Icons.TbTags className="menu_icon" />,
    subMenu: [
      {
        name: "Gerenciar Marcas",
        url: "/manage",
        icon: <Icons.TbList className="menu_icon" />,
      },
      {
        name: "Adicionar Marca",
        url: "/add",
        icon: <Icons.TbCirclePlus className="menu_icon" />,
      },
    ],
  },
  {
    name: "Vendas",
    url: "/venue",
    icon: <Icons.TbCurrencyDollar className="menu_icon" />,
  },
  {
    name: "Páginas",
    url: "/pages",
    icon: <Icons.TbPlug className="menu_icon" />,
  },
  {
    name: "Mídia",
    url: "/media",
    icon: <Icons.TbPhoto className="menu_icon" />,
  },
  {
    name: "Pagamento",
    url: "/payment",
    icon: <Icons.TbCreditCard className="menu_icon" />,
    subMenu: [
      {
        name: "Transações",
        url: "/transactions",
        icon: <Icons.TbCurrencyDollar className="menu_icon" />,
      },
      {
        name: "Métodos de Pagamento",
        url: "/payment-method",
        icon: <Icons.TbDeviceMobileDollar className="menu_icon" />,
      },
    ],
  },
  {
    name: "Configurações",
    url: "/setting",
    icon: <Icons.TbSettings className="menu_icon" />,
    subMenu: [
      {
        name: "Geral",
        url: "/general",
        icon: <Icons.TbSettings className="menu_icon" />,
      },
      {
        name: "E-mail",
        url: "/email",
        icon: <Icons.TbMail className="menu_icon" />,
      },
      {
        name: "Idiomas",
        url: "/languages",
        icon: <Icons.TbLanguage className="menu_icon" />,
      },
      {
        name: "Link Permanente",
        url: "/permalink",
        icon: <Icons.TbLink className="menu_icon" />,
      },
      {
        name: "Login Social",
        url: "/social-login",
        icon: <Icons.TbLogin className="menu_icon" />,
      },
      {
        name: "Tarefas Agendadas",
        url: "/cronjob",
        icon: <Icons.TbClock className="menu_icon" />,
      },
      {
        name: "Configurações da API",
        url: "/api",
        icon: <Icons.TbSettings className="menu_icon" />,
      },
    ],
  },
  {
    name: "Administração",
    url: "/admin",
    icon: <Icons.TbShieldLock className="menu_icon" />,
    subMenu: [
      {
        name: "Funções e Permissões",
        url: "/admin/roles",
        icon: <Icons.TbUserShield className="menu_icon" />,
      },
      {
        name: "Usuários",
        url: "/admin/users",
        icon: <Icons.TbUsers className="menu_icon" />,
      },
    ],
  },
];

export default navigation;
