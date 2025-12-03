import { Category } from '../types';
import styles from './CategoryFilter.module.css';

interface Props {
  categories: Category[];
  active: number | null;
  onSelect: (id: number | null) => void;
}

function CategoryFilter({ categories, active, onSelect }: Props) {
  return (
    <div className={styles.bar}>
      <button className={!active ? styles.active : ''} onClick={() => onSelect(null)}>
        Todo
      </button>
      {categories.map((category) => (
        <button
          key={category.id_key}
          className={active === category.id_key ? styles.active : ''}
          onClick={() => onSelect(category.id_key)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
