import { useEffect, useRef, useState, type PointerEvent } from 'react';
import styles from './StoneCheckbox.module.scss';
import { BowlIcon } from './icons/BowlIcon';
import { CheckIcon } from './icons/CheckIcon';
import { StoneIcon } from './icons/StoneIcon';

type Stone = {
  id: number;
  x: number;
  y: number;
  placed: boolean;
  color: string;
};

type StoneCheckboxProps = {
  count?: number;
  text?: string;
  onChange?: (checked: boolean) => void;
};

const STONE_SIZE = 21;
const STONE_GAP = -5;

// Создаём горку камней.
const getPilePositions = (count: number) => {
  const positions: { x: number; y: number }[] = [];

  const rowHeight = STONE_SIZE - 10;
  const stoneStep = STONE_SIZE + STONE_GAP;

  let remaining = count;
  let row = 1;

  const rows: number[] = [];

  while (remaining > 0) {
    const stonesInRow = Math.min(row, remaining);

    rows.push(stonesInRow);

    remaining -= stonesInRow;
    row += 1;
  }

  const orderedRows = count % 2 === 0 ? [...rows].reverse() : rows;

  const maxRow = Math.max(...rows);

  orderedRows.forEach((stonesInRow, rowIndex) => {
    const y = rowIndex * rowHeight;

    const rowWidth = (stonesInRow - 1) * stoneStep;
    const maxRowWidth = (maxRow - 1) * stoneStep;

    const startX = (maxRowWidth - rowWidth) / 2;

    for (let i = 0; i < stonesInRow; i++) {
      positions.push({
        x: startX + i * stoneStep,
        y,
      });
    }
  });

  return positions;
};

// Позиции камней внутри чаши.
// Не зависят от количества камней.
// Если камней много - они просто немного перекрываются.

const BOWL_OFFSET_Y = -10;

const getBowlPosition = (index: number) => {
  const positions = [
    { x: -11, y: 5 },
    { x: 8, y: 5 },
    { x: -2, y: 4 },
    { x: -7, y: 0 },
    { x: 5, y: 0 },
    { x: 0, y: -5 },
    { x: -3, y: -8 },
  ];

  const position = positions[index];

  if (position) {
    return {
      x: position.x,
      y: position.y + BOWL_OFFSET_Y,
    };
  }

  return {
    x: ((index * 7) % 14) - 7,
    y: -8 - Math.floor(index / 3) * 3 + BOWL_OFFSET_Y,
  };
};

const createInitialStones = (count: number): Stone[] => {
  const positions = getPilePositions(count);

  return positions.map((position, index) => ({
    id: index + 1,
    x: position.x,
    y: position.y,
    placed: false,
    color: 'gray',
  }));
};

export const StoneCheckbox = ({
  count = 3,
  text,
  onChange,
}: StoneCheckboxProps) => {
  const [stones, setStones] = useState<Stone[]>(() =>
    createInitialStones(count),
  );

  const [draggingId, setDraggingId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const bowlRef = useRef<HTMLDivElement>(null);

  const isChecked = stones.length > 0 && stones.every((stone) => stone.placed);

  useEffect(() => {
    onChange?.(isChecked);
  }, [isChecked, onChange]);
  
  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
    id: number,
  ) => {
    const stone = stones.find((item) => item.id === id);

    if (!stone || stone.placed) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    setDraggingId(id);
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
    id: number,
  ) => {
    if (draggingId !== id || !containerRef.current) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const x = event.clientX - containerRect.left - STONE_SIZE / 2;

    const y = event.clientY - containerRect.top - STONE_SIZE / 2;

    setStones((current) =>
      current.map((stone) =>
        stone.id === id
          ? {
              ...stone,
              x,
              y,
            }
          : stone,
      ),
    );
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>, id: number) => {
    if (!containerRef.current || !bowlRef.current) {
      setDraggingId(null);
      return;
    }

    const bowlRect = bowlRef.current.getBoundingClientRect();

    const stoneRect = event.currentTarget.getBoundingClientRect();

    const stoneCenterX = stoneRect.left + stoneRect.width / 2;

    const stoneCenterY = stoneRect.top + stoneRect.height / 2;

    const isInsideBowl =
      stoneCenterX >= bowlRect.left &&
      stoneCenterX <= bowlRect.right &&
      stoneCenterY >= bowlRect.top &&
      stoneCenterY <= bowlRect.bottom;

    if (isInsideBowl) {
      placeStone(id);
    } else {
      returnStone(id);
    }

    setDraggingId(null);
  };

  const placeStone = (id: number) => {
    if (!containerRef.current || !bowlRef.current) {
      return;
    }

    const bowlRect = bowlRef.current.getBoundingClientRect();

    const containerRect = containerRef.current.getBoundingClientRect();

    const bowlCenterX =
      bowlRect.left + bowlRect.width / 2 - containerRect.left - STONE_SIZE / 2;

    const bowlCenterY =
      bowlRect.top + bowlRect.height / 2 - containerRect.top - STONE_SIZE / 2;

    const placedCount = stones.filter((stone) => stone.placed).length;

    const position = getBowlPosition(placedCount);

    setStones((current) =>
      current.map((stone) =>
        stone.id === id
          ? {
              ...stone,
              x: bowlCenterX + position.x,
              y: bowlCenterY + position.y,
              placed: true,
            }
          : stone,
      ),
    );
  };

  const returnStone = (id: number) => {
    const initialPositions = getPilePositions(stones.length);

    const stoneIndex = stones.findIndex((stone) => stone.id === id);

    if (stoneIndex === -1) {
      return;
    }

    const position = initialPositions[stoneIndex];

    setStones((current) =>
      current.map((stone) =>
        stone.id === id
          ? {
              ...stone,
              x: position.x,
              y: position.y,
              placed: false,
            }
          : stone,
      ),
    );
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {isChecked ? (
        <div className={styles.check}>
          <CheckIcon />
        </div>
      ) : (
        <>
          <div className={styles.pile}>
            {stones.map((stone) => (
              <div
                key={stone.id}
                className={`
              ${styles.stone}
              ${stone.placed ? styles.stonePlaced : ''}
              ${draggingId === stone.id ? styles.stoneDragging : ''}
            `}
                style={{
                  transform: `translate(${stone.x}px, ${stone.y}px)`,
                  color: stone.color,
                  zIndex: draggingId === stone.id ? 100 : stone.id,
                }}
                onPointerDown={(event) => handlePointerDown(event, stone.id)}
                onPointerMove={(event) => handlePointerMove(event, stone.id)}
                onPointerUp={(event) => handlePointerUp(event, stone.id)}
              >
                <StoneIcon />
              </div>
            ))}
          </div>

          <div ref={bowlRef} className={styles.bowl}>
            <BowlIcon />
          </div>
        </>
      )}
      <span className={styles.text}>{text}</span>
    </div>
  );
};
