import { CodeSandboxOutlined } from '@ant-design/icons';
import { Select } from 'antd';

const LabeledSelect = ({
    label,
    placeholder = 'Please select',
    options = [],
    filterOption,
    value,
    onChange,
    allowClear = true,
    icon,
    disabled = false,
    required = false,
}) => {
    return (
        <div className="w-full mb-4">
            <label>{icon}</label>
            <label className="block font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
                aria-required={required}
                size='large'
                disabled={disabled}
                showSearch
                placeholder={placeholder}
                options={options}
                filterOption={filterOption}
                allowClear={allowClear && !required}
                style={{ width: '100%' }}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default LabeledSelect;