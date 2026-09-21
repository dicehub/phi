import { defineComponent, h, ref } from "vue";
import {
  PhCaretUpDown,
  PhCube,
  PhStack,
  PhStackSimple,
} from "@phosphor-icons/vue";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";
import { useSidebar, type SidebarState } from "@dicehub/phi/components/sidebar";

const accounts = [
  { id: "company", name: "Company", icon: PhCube },
  { id: "personal", name: "Personal", icon: PhStack },
  { id: "staging", name: "Staging", icon: PhStackSimple },
];

let accountSwitcherId = 0;

export const AccountSwitcher = defineComponent({
  name: "SidebarDemoAccountSwitcher",
  setup() {
    accountSwitcherId += 1;
    const menuId = `sidebar-demo-account-${accountSwitcherId}`;
    const active = ref(accounts[0].id);
    const activeAccount = () => accounts.find((account) => account.id === active.value) ?? accounts[0];

    return () =>
      h(
        DropdownMenu,
        { id: menuId, positioning: { placement: "bottom-start", gutter: 8 } },
        {
          default: () => [
            h(
              DropdownMenu.Trigger,
              null,
              {
                default: () =>
                  h(
                    "button",
                    {
                      type: "button",
                      class: "sidebar-demo-account",
                    },
                    [
                      h(activeAccount().icon, {
                        class: "sidebar-demo-account__icon",
                        weight: "duotone",
                      }),
                      h("span", activeAccount().name),
                      h(PhCaretUpDown, { class: "sidebar-demo-account__caret" }),
                    ],
                  ),
              },
            ),
            h(
              DropdownMenu.Content,
              { class: "sidebar-demo-account-menu" },
              {
                default: () =>
                  accounts.map((account) =>
                    h(
                      DropdownMenu.Item,
                      {
                        key: account.id,
                        value: account.id,
                        selected: account.id === active.value,
                        onSelect: () => {
                          active.value = account.id;
                        },
                      },
                      {
                        default: () => [
                          h(account.icon, {
                            class: "sidebar-demo-account-menu__icon",
                            weight: "duotone",
                          }),
                          account.name,
                        ],
                      },
                    ),
                  ),
              },
            ),
          ],
        },
      );
  },
});

export const ToggleButton = defineComponent({
  name: "SidebarDemoToggleButton",
  setup() {
    const sidebar = useSidebar();

    return () =>
      h(
        "button",
        {
          type: "button",
          class: "sidebar-demo-button",
          onClick: sidebar.toggleSidebar,
        },
        sidebar.state.value === "expanded" ? "Collapse" : "Expand",
      );
  },
});

export const PeekStateIndicator = defineComponent({
  name: "SidebarDemoPeekStateIndicator",
  setup() {
    const sidebar = useSidebar();
    const labels: Record<SidebarState, string> = {
      expanded: "Expanded",
      collapsed: "Collapsed",
      peeking: "Peeking",
    };

    return () =>
      h("div", { class: "sidebar-demo-main-stack" }, [
        h("span", { class: "sidebar-demo-main-title" }, `State: ${labels[sidebar.state.value]}`),
        h("p", "Collapse, then hover the sidebar to peek"),
      ]);
  },
});

export const MobileToggleButton = defineComponent({
  name: "SidebarDemoMobileToggleButton",
  setup() {
    const sidebar = useSidebar();

    return () =>
      h(
        "button",
        {
          type: "button",
          class: "sidebar-demo-button",
          onClick: sidebar.toggleSidebar,
        },
        sidebar.openMobile.value ? "Close sidebar" : "Open sidebar",
      );
  },
});
