import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import LabeledSelect from "../../../components/LabelSelect";

export const columnsPurchasing = ({ onUpdate, onDelete }) => [
  { title: 'ID', dataIndex: 'roworder', key: 'roworder' },
  { title: 'Name (Lao)', dataIndex: 'name_1', key: 'name_1' },
  { title: 'Name (EN)', dataIndex: 'name_2', key: 'name_2' },
  { title: 'Unit', dataIndex: 'unit_code', key: 'unit_code' },
  { title: 'ໝວດສີນຄ້າຫລັກ', dataIndex: 'ph1', key: 'ph1' },
  { title: 'ໝວດສີນຄ້າຍອ່ຍ1', dataIndex: 'ph2', key: 'ph2' },
  { title: 'ໝວດສີນຄ້າຍອ່ຍ2', dataIndex: 'ph3', key: 'ph3' },
  { title: 'ປະເພດສີນຄ່າ', dataIndex: 'ph4', key: 'ph4' },
  { title: 'ຍີ່ຫໍ້', dataIndex: 'ph5', key: 'ph5' },
  { title: 'ຮູບແບບ', dataIndex: 'ph6', key: 'ph6' },
  { title: 'ຂະໜາດ', dataIndex: 'ph7', key: 'ph7' },
  { title: 'ອອກແບບ', dataIndex: 'ph8', key: 'ph8' },
  { title: 'Warehouse', dataIndex: 'wh', key: 'wh' },
  { title: 'Shelf', dataIndex: 'sh', key: 'sh' },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render: (text, record) => (
      <div
        className="flex gap-2"
      >
        <button
          onClick={() => onUpdate(record)}
        >
          <EditOutlined style={{ fontSize: '20px', color: 'orange' }} />
        </button>
        <button
          onClick={() => onDelete(record)}
        >
          <DeleteOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
        </button>
      </div>
    )
  }
];
export const columnsPurchasingApprove = [
  { title: 'ID', dataIndex: 'roworder', key: 'roworder' },
  { title: 'Name (Lao)', dataIndex: 'name_1', key: 'name_1' },
  { title: 'Name (EN)', dataIndex: 'name_2', key: 'name_2' },
  { title: 'Unit', dataIndex: 'unit_code', key: 'unit_code' },
  { title: 'ໝວດສີນຄ້າຫລັກ', dataIndex: 'ph1', key: 'ph1' },
  { title: 'ໝວດສີນຄ້າຍອ່ຍ1', dataIndex: 'ph2', key: 'ph2' },
  { title: 'ໝວດສີນຄ້າຍອ່ຍ2', dataIndex: 'ph3', key: 'ph3' },
  { title: 'ປະເພດສີນຄ່າ', dataIndex: 'ph4', key: 'ph4' },
  { title: 'ຍີ່ຫໍ້', dataIndex: 'ph5', key: 'ph5' },
  { title: 'ຮູບແບບ', dataIndex: 'ph6', key: 'ph6' },
  { title: 'ຂະໜາດ', dataIndex: 'ph7', key: 'ph7' },
  { title: 'ອອກແບບ', dataIndex: 'ph8', key: 'ph8' },
  { title: 'Warehouse', dataIndex: 'wh', key: 'wh' },
  { title: 'Shelf', dataIndex: 'sh', key: 'sh' },
];



export const createColumnsPurchasing = ({
  accountCodeOptions = [],
  onAccountCodeChange,
  loadingAccountCodes = false,
}) => [
    { title: 'ID', dataIndex: 'roworder', key: 'roworder' },
    { title: 'Name (Lao)', dataIndex: 'name_1', key: 'name_1' },
    { title: 'Name (EN)', dataIndex: 'name_2', key: 'name_2' },
    { title: 'Unit', dataIndex: 'unit_code', key: 'unit_code' },
    { title: 'ໝວດສີນຄ້າຫລັກ', dataIndex: 'ph1', key: 'ph1' },
    { title: 'ໝວດສີນຄ້າຍອ່ຍ1', dataIndex: 'ph2', key: 'ph2' },
    { title: 'ໝວດສີນຄ້າຍອ່ຍ2', dataIndex: 'ph3', key: 'ph3' },
    { title: 'ປະເພດສີນຄ່າ', dataIndex: 'ph4', key: 'ph4' },
    { title: 'ຍີ່ຫໍ້', dataIndex: 'ph5', key: 'ph5' },
    { title: 'ຮູບແບບ', dataIndex: 'ph6', key: 'ph6' },
    { title: 'ຂະໜາດ', dataIndex: 'ph7', key: 'ph7' },
    { title: 'ອອກແບບ', dataIndex: 'ph8', key: 'ph8' },
    { title: 'Warehouse', dataIndex: 'wh', key: 'wh' },
    { title: 'Shelf', dataIndex: 'sh', key: 'sh' },
    {
      title: 'Account Code 1',
      dataIndex: 'code',
      key: 'code',
      width: 200,
      render: (value, record, index) => (
        <LabeledSelect
          required
          label=""
          placeholder="Select account code 1"
          options={accountCodeOptions}
          value={value}
          disabled={loadingAccountCodes}
          onChange={(newValue) => onAccountCodeChange?.(index, 'account_code1', newValue)}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      )
    },
    {
      title: 'Account Code 2',
      dataIndex: 'code',
      key: 'code',
      width: 200,
      render: (value, record, index) => (
        <LabeledSelect
          required
          placeholder="Select account code 2"
          options={accountCodeOptions}
          value={value}
          disabled={loadingAccountCodes}
          onChange={(newValue) => onAccountCodeChange?.(index, 'account_code2', newValue)}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      )
    },
    {
      title: 'Account Code 3',
      dataIndex: 'code',
      key: 'code',
      width: 200,
      render: (value, record, index) => (
        <LabeledSelect
          required
          placeholder="Select account code 3"
          options={accountCodeOptions}
          value={value}
          disabled={loadingAccountCodes}
          onChange={(newValue) => onAccountCodeChange?.(index, 'account_code3', newValue)}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      )
    },
    {
      title: 'Account Code 4',
      dataIndex: 'code',
      key: 'code',
      width: 200,
      render: (value, record, index) => (
        <LabeledSelect
          required
          placeholder="Select account code 4"
          options={accountCodeOptions}
          value={value}
          disabled={loadingAccountCodes}
          onChange={(newValue) => onAccountCodeChange?.(index, 'account_code4', newValue)}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      )
    },
  ];
