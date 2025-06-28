import { Select, Tag } from 'antd';

const tagRender = (props) => {
  const { label, value, onClose } = props;

  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };


  const tagColor = typeof value === 'string' && value.match(/^#|[a-zA-Z]/) ? value : undefined;

  return (
    <Tag
      color={tagColor}
      className='text-black'
      onMouseDown={onPreventMouseDown}
      closable={true}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {typeof label === 'string' ? label : JSON.stringify(label)}
    </Tag>
  );
};


const LabeledSelectMulti = ({
  label,
  placeholder = 'Please select',
  value,
  onChange,
  allowClear = true,
  icon,
  disabled = false,
}) => {
  return (
    <div className="w-full mb-4">
      <label>{icon}</label>
      <label className="block font-medium text-gray-700 mb-1">
        {typeof label === 'string' ? label : JSON.stringify(label)}
      </label>
      <Select
        mode="multiple"
        tagRender={tagRender}
        placeholder={placeholder}
        allowClear={allowClear}
        style={{ width: '100%' }}
        value={value}
        onChange={onChange}
        disabled={disabled}
        open={false}
        options={[]}
      />
    </div>
  );
};


export default LabeledSelectMulti;
