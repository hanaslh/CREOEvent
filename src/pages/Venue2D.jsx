import '/src/pages/Venue2D.css';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaUndo,
  FaRedo,
  FaPlus,
  FaMinus,
  FaBuilding,
  FaChair,
  FaDoorOpen,
  FaVectorSquare,
  FaInfoCircle,
  FaUsers,
  FaTextHeight,
  FaEraser,
  FaMousePointer,
  FaRuler,
  FaExpand,
  FaCompress,
  FaSearch,
  FaPrint,
  FaDownload,
  FaCopy,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaLayerGroup,
  FaObjectGroup,
  FaRegObjectGroup,
  FaDrawPolygon,
  FaCube,
  FaBorderAll
} from 'react-icons/fa';

const Venue2D = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const canvasRef = useRef(null);
  const [venue, setVenue] = useState(null);
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [gridVisible, setGridVisible] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentObject, setCurrentObject] = useState(null);
  const [scale, setScale] = useState(20);
  const [showExhibitorModal, setShowExhibitorModal] = useState(false);
  const [currentExhibitor, setCurrentExhibitor] = useState(null);
  const [showStandConfig, setShowStandConfig] = useState(false);
  const [standConfig, setStandConfig] = useState({ width: 3, depth: 3, name: '' });
  
  // Simplified wall drawing states
  const [isDrawingWall, setIsDrawingWall] = useState(false);
  const [wallStartPoint, setWallStartPoint] = useState(null);
  const [wallThickness, setWallThickness] = useState(0.2);

  // Sample exhibitor database
  const exhibitorDatabase = [
    {
      id: 1,
      company: "TechCorp Solutions",
      industry: "Technology",
      products: ["AI Platforms", "Cloud Services", "IoT Devices"],
      contact: "John Smith - john@techcorp.com",
      website: "www.techcorp.com",
      description: "Leading provider of innovative technology solutions for modern businesses.",
      logo: "TC",
      color: "#3B82F6"
    },
    {
      id: 2,
      company: "GreenEnergy Inc",
      industry: "Renewable Energy",
      products: ["Solar Panels", "Wind Turbines", "Energy Storage"],
      contact: "Sarah Johnson - sarah@greenenergy.com",
      website: "www.greenenergy.com",
      description: "Sustainable energy solutions for a greener future.",
      logo: "GE",
      color: "#10B981"
    }
  ];

  const tools = [
    { id: 'select', name: 'Select', icon: FaMousePointer, color: '#5ce4f6' },
    { id: 'wall', name: 'Draw Wall', icon: FaCube, color: '#6b7280' },
    { id: 'stand', name: 'Exhibition Stand', icon: FaBuilding, color: '#5ce4f6' },
    { id: 'furniture', name: 'Furniture', icon: FaChair, color: '#10b981' },
    { id: 'door', name: 'Door', icon: FaDoorOpen, color: '#f59e0b' },
    { id: 'zone', name: 'Zone', icon: FaVectorSquare, color: '#06b6d4' },
    { id: 'info', name: 'Info Point', icon: FaInfoCircle, color: '#EC4899' },
    { id: 'text', name: 'Add Text', icon: FaTextHeight, color: '#5ce4f6' },
    { id: 'measure', name: 'Measure', icon: FaRuler, color: '#84CC16' }
  ];

  const furnitureItems = [
    { id: 1, name: 'Exhibition Stand', type: 'stand', width: 3, depth: 3, color: '#5ce4f6', icon: FaBuilding },
    { id: 2, name: 'Info Desk', type: 'desk', width: 2, depth: 1, color: '#06b6d4', icon: FaInfoCircle },
    { id: 3, name: 'Stage', type: 'stage', width: 6, depth: 4, color: '#10b981', icon: FaVectorSquare },
    { id: 4, name: 'Seating Area', type: 'seating', width: 4, depth: 4, color: '#f59e0b', icon: FaChair }
  ];

  // Initialize venue
  useEffect(() => {
    if (location.state?.venue) {
      setVenue(location.state.venue);
    } else {
      setVenue({
        name: "Exhibition Hall A",
        dimensions: {
          width: 40,
          length: 30,
          height: 5
        }
      });
    }
  }, [location]);

  // Keyboard event handler for moving objects
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedObject) return;

      const moveDistance = snapToGrid ? scale : 5;
      let newX = selectedObject.x;
      let newY = selectedObject.y;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newY -= moveDistance;
          break;
        case 'ArrowDown':
          e.preventDefault();
          newY += moveDistance;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newX -= moveDistance;
          break;
        case 'ArrowRight':
          e.preventDefault();
          newX += moveDistance;
          break;
        case 'Delete':
          e.preventDefault();
          deleteSelectedObject();
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedObject(null);
          if (isDrawingWall) {
            setIsDrawingWall(false);
            setWallStartPoint(null);
          }
          break;
      }

      if (newX !== selectedObject.x || newY !== selectedObject.y) {
        updateObject(selectedObject.id, {
          x: Math.max(0, newX),
          y: Math.max(0, newY)
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObject, snapToGrid, scale]);

  // Drawing functions
  const drawGrid = (ctx, width, height) => {
    const gridSize = scale;
    const startX = -pan.x / zoom;
    const startY = -pan.y / zoom;
    const endX = startX + width / zoom;
    const endY = startY + height / zoom;

    ctx.strokeStyle = 'rgba(92, 228, 246, 0.2)';
    ctx.lineWidth = 1;

    for (let x = Math.floor(startX / gridSize) * gridSize; x < endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }

    for (let y = Math.floor(startY / gridSize) * gridSize; y < endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
  };

  const drawVenue = (ctx) => {
    if (!venue) return;
    
    const { width, length } = venue.dimensions;
    
    ctx.strokeStyle = '#5ce4f6';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.strokeRect(0, 0, width * scale, length * scale);

    // Draw dimensions
    ctx.fillStyle = '#5ce4f6';
    ctx.font = '12px Arial';
    ctx.fillText(`${width}m`, width * scale / 2 - 10, -10);
    ctx.fillText(`${length}m`, -30, length * scale / 2);
  };

  const drawResizeHandles = (ctx, obj) => {
    const handles = [
      { x: obj.x - 4, y: obj.y - 4 },
      { x: obj.x + obj.width * scale - 4, y: obj.y - 4 },
      { x: obj.x - 4, y: obj.y + obj.depth * scale - 4 },
      { x: obj.x + obj.width * scale - 4, y: obj.y + obj.depth * scale - 4 }
    ];

    ctx.fillStyle = '#5ce4f6';
    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, 8, 8);
    });
  };

  const drawMeasurement = (ctx, obj) => {
    ctx.strokeStyle = '#84CC16';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y - 20);
    ctx.lineTo(obj.x + obj.width * scale, obj.y - 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(obj.x - 20, obj.y);
    ctx.lineTo(obj.x - 20, obj.y + obj.depth * scale);
    ctx.stroke();

    ctx.fillStyle = '#84CC16';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${obj.width}m`, obj.x + (obj.width * scale) / 2, obj.y - 25);
    ctx.fillText(`${obj.depth}m`, obj.x - 25, obj.y + (obj.depth * scale) / 2);
  };

  const drawObject = (ctx, obj, isPreview = false) => {
    const isSelected = selectedObject?.id === obj.id;
    
    ctx.save();
    
    if (isPreview) {
      ctx.globalAlpha = 0.6;
    }

    if (obj.angle) {
      const centerX = obj.x + (obj.width * scale) / 2;
      const centerY = obj.y + (obj.depth * scale) / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate(obj.angle * Math.PI / 180);
      ctx.translate(-centerX, -centerY);
    }

    if (isSelected) {
      ctx.strokeStyle = '#5ce4f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = obj.color || '#666';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
    }

    ctx.fillStyle = obj.color ? `${obj.color}33` : '#666333';

    switch (obj.type) {
      case 'stand':
      case 'furniture':
        ctx.fillRect(obj.x, obj.y, obj.width * scale, obj.depth * scale);
        ctx.strokeRect(obj.x, obj.y, obj.width * scale, obj.depth * scale);
        
        if (obj.label) {
          ctx.fillStyle = '#fff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            obj.label, 
            obj.x + (obj.width * scale) / 2, 
            obj.y + (obj.depth * scale) / 2
          );
        }
        break;

      case 'wall':
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(obj.x, obj.y, obj.width * scale, obj.depth * scale);
        ctx.strokeRect(obj.x, obj.y, obj.width * scale, obj.depth * scale);
        
        if (isSelected) {
          ctx.fillStyle = '#fff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            `${obj.width.toFixed(1)}m`, 
            obj.x + (obj.width * scale) / 2, 
            obj.y - 10
          );
        }
        break;

      case 'door':
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(obj.x, obj.y);
        ctx.lineTo(obj.x + obj.width * scale, obj.y);
        ctx.stroke();
        break;

      case 'zone':
        ctx.fillStyle = `${obj.color || '#06b6d4'}22`;
        ctx.strokeStyle = obj.color || '#06b6d4';
        ctx.setLineDash([5, 5]);
        ctx.fillRect(obj.x, obj.y, obj.width * scale, obj.depth * scale);
        ctx.strokeRect(obj.x, obj.y, obj.width * scale, obj.depth * scale);
        break;

      case 'info':
        ctx.fillStyle = obj.color || '#EC4899';
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;

      case 'text':
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(obj.text, obj.x, obj.y);
        break;
    }

    ctx.restore();

    if (isSelected && obj.resizable !== false && !obj.angle) {
      drawResizeHandles(ctx, obj);
    }
  };

  const drawWallPreview = (ctx, startX, startY, currentX, currentY) => {
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = wallThickness * scale;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !venue) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    if (gridVisible) {
      drawGrid(ctx, width, height);
    }

    drawVenue(ctx);

    objects.forEach(obj => {
      drawObject(ctx, obj);
    });

    if (isDrawingWall && wallStartPoint) {
      const rect = canvas.getBoundingClientRect();
      const currentX = (wallStartPoint.clientX - rect.left - pan.x) / zoom;
      const currentY = (wallStartPoint.clientY - rect.top - pan.y) / zoom;
      drawWallPreview(ctx, wallStartPoint.x, wallStartPoint.y, currentX, currentY);
    }

    if (currentObject && !isDrawingWall) {
      drawObject(ctx, currentObject, true);
    }

    if (activeTool === 'measure' && currentObject) {
      drawMeasurement(ctx, currentObject);
    }

    ctx.restore();
  };

  // Simple wall drawing
  const startWallDrawing = (x, y) => {
    const snappedX = snapToGrid ? Math.round(x / scale) * scale : x;
    const snappedY = snapToGrid ? Math.round(y / scale) * scale : y;
    
    setWallStartPoint({ x: snappedX, y: snappedY, clientX: 0, clientY: 0 });
    setIsDrawingWall(true);
  };

  const completeWallDrawing = (x, y) => {
    if (!wallStartPoint) return;

    const snappedX = snapToGrid ? Math.round(x / scale) * scale : x;
    const snappedY = snapToGrid ? Math.round(y / scale) * scale : y;

    const dx = snappedX - wallStartPoint.x;
    const dy = snappedY - wallStartPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > 0.1) { // Minimum wall length
      const wall = {
        id: Date.now() + Math.random(),
        type: 'wall',
        x: wallStartPoint.x,
        y: wallStartPoint.y - (wallThickness * scale) / 2,
        width: length / scale,
        depth: wallThickness,
        angle: Math.atan2(dy, dx) * (180 / Math.PI),
        color: '#6b7280'
      };
      
      addObject(wall);
    }

    setIsDrawingWall(false);
    setWallStartPoint(null);
  };

  // Event handlers
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (e.button === 1 || e.ctrlKey) {
      setIsPanning(true);
      return;
    }

    if (activeTool === 'wall') {
      startWallDrawing(x, y);
      return;
    }

    if (activeTool === 'select') {
      const clickedObject = findObjectAt(x, y);
      if (clickedObject) {
        setSelectedObject(clickedObject);
        const handle = getResizeHandle(clickedObject, x, y);
        if (handle) {
          setIsDrawing(true);
          setCurrentObject({ ...clickedObject, resizing: true, resizeHandle: handle });
        } else {
          setIsDrawing(true);
          setCurrentObject({ 
            ...clickedObject, 
            moving: true, 
            offsetX: x - clickedObject.x, 
            offsetY: y - clickedObject.y 
          });
        }
      } else {
        setSelectedObject(null);
      }
    } else if (activeTool !== 'select') {
      const snappedX = snapToGrid ? Math.round(x / scale) * scale : x;
      const snappedY = snapToGrid ? Math.round(y / scale) * scale : y;
      
      let newObj = {
        id: Date.now(),
        type: activeTool,
        x: snappedX,
        y: snappedY,
        width: 0,
        depth: 0,
        color: getToolColor(activeTool)
      };

      if (activeTool === 'furniture') {
        const furniture = furnitureItems[0];
        newObj = {
          ...newObj,
          width: furniture.width,
          depth: furniture.depth,
          color: furniture.color,
          label: furniture.name,
          furnitureType: furniture.type
        };
        addObject(newObj);
      } else if (activeTool === 'stand') {
        setShowStandConfig(true);
        return;
      } else if (activeTool === 'text') {
        const text = prompt('Enter text:');
        if (text) {
          newObj.text = text;
          addObject(newObj);
        }
        return;
      } else if (activeTool === 'door') {
        newObj.width = 2;
        newObj.depth = 0.1;
        addObject(newObj);
      } else if (activeTool === 'info') {
        newObj.width = 1;
        newObj.depth = 1;
        addObject(newObj);
      } else {
        setCurrentObject(newObj);
        setIsDrawing(true);
      }
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (isPanning) {
      setPan(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
      return;
    }

    if (isDrawingWall && wallStartPoint) {
      // Update wall preview
      setWallStartPoint(prev => ({ ...prev, clientX: e.clientX, clientY: e.clientY }));
      return;
    }

    if (isDrawing && currentObject) {
      if (currentObject.moving) {
        const snappedX = snapToGrid ? Math.round((x - currentObject.offsetX) / scale) * scale : x - currentObject.offsetX;
        const snappedY = snapToGrid ? Math.round((y - currentObject.offsetY) / scale) * scale : y - currentObject.offsetY;
        
        updateObject(currentObject.id, {
          x: Math.max(0, snappedX),
          y: Math.max(0, snappedY)
        });
      } else if (currentObject.resizing) {
        const handle = currentObject.resizeHandle;
        const newWidth = Math.max(0.5, (x - currentObject.x) / scale);
        const newDepth = Math.max(0.5, (y - currentObject.y) / scale);
        
        updateObject(currentObject.id, {
          width: handle.includes('right') ? newWidth : currentObject.width,
          depth: handle.includes('bottom') ? newDepth : currentObject.depth,
          x: handle.includes('left') ? x : currentObject.x,
          y: handle.includes('top') ? y : currentObject.y
        });
      } else {
        const snappedX = snapToGrid ? Math.round(x / scale) * scale : x;
        const snappedY = snapToGrid ? Math.round(y / scale) * scale : y;
        
        const width = Math.max(0.5, (snappedX - currentObject.x) / scale);
        const depth = Math.max(0.5, (snappedY - currentObject.y) / scale);
        
        setCurrentObject(prev => ({
          ...prev,
          width,
          depth
        }));
      }
    }
  };

  const handleMouseUp = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (isDrawingWall) {
      completeWallDrawing(x, y);
    }

    if (isDrawing && currentObject && !currentObject.moving && !currentObject.resizing) {
      if (currentObject.width > 0 && currentObject.depth > 0) {
        addObject(currentObject);
      }
    }
    
    setIsDrawing(false);
    setIsPanning(false);
    setCurrentObject(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY / 1000;
    const newZoom = Math.min(Math.max(0.1, zoom + delta), 5);
    setZoom(newZoom);
  };

  // Helper functions
  const findObjectAt = (x, y) => {
    return objects.find(obj => {
      return x >= obj.x && 
             x <= obj.x + obj.width * scale && 
             y >= obj.y && 
             y <= obj.y + obj.depth * scale;
    });
  };

  const getResizeHandle = (obj, x, y) => {
    const handles = [
      { x: obj.x - 4, y: obj.y - 4, type: 'top-left' },
      { x: obj.x + obj.width * scale - 4, y: obj.y - 4, type: 'top-right' },
      { x: obj.x - 4, y: obj.y + obj.depth * scale - 4, type: 'bottom-left' },
      { x: obj.x + obj.width * scale - 4, y: obj.y + obj.depth * scale - 4, type: 'bottom-right' }
    ];

    const handle = handles.find(h => 
      x >= h.x && x <= h.x + 8 && y >= h.y && y <= h.y + 8
    );
    
    return handle ? handle.type : null;
  };

  const getToolColor = (tool) => {
    const toolConfig = tools.find(t => t.id === tool);
    return toolConfig ? toolConfig.color : '#666';
  };

  const addObject = (obj) => {
    if (obj.type === 'stand') {
      const exhibitor = exhibitorDatabase[Math.floor(Math.random() * exhibitorDatabase.length)];
      obj.exhibitorId = exhibitor.id;
      obj.label = standConfig.name || exhibitor.company;
      obj.color = exhibitor.color;
    }
    
    setObjects(prev => [...prev, obj]);
    setSelectedObject(obj);
  };

  const updateObject = (id, updates) => {
    setObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, ...updates } : obj
    ));
    setSelectedObject(prev => prev?.id === id ? { ...prev, ...updates } : prev);
  };

  const deleteSelectedObject = () => {
    if (selectedObject) {
      setObjects(prev => prev.filter(obj => obj.id !== selectedObject.id));
      setSelectedObject(null);
    }
  };

  const confirmStandPlacement = () => {
    const newObj = {
      id: Date.now(),
      type: 'stand',
      x: 100,
      y: 100,
      width: standConfig.width,
      depth: standConfig.depth,
      label: standConfig.name
    };
    addObject(newObj);
    setShowStandConfig(false);
  };

  const savePlan = () => {
    const plan = {
      venue,
      objects,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('venue2DPlan', JSON.stringify(plan));
    alert('Floor plan saved successfully!');
  };

  const exportPlan = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'floor-plan.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    draw();
  }, [venue, objects, currentObject, zoom, pan, gridVisible, activeTool, isDrawingWall, wallStartPoint]);

  if (!venue) {
    return (
      <div className="venue-2d-page">
        <header className="planning-header">
          <div className="container">
            <div className="header-content">
              <button onClick={() => navigate('/event-planner')} className="back-btn">
                <FaArrowLeft /> Back to Planner
              </button>
              <div className="header-title">
                <h1>2D Floor Planning</h1>
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading floor planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="venue-2d-page">
      <header className="planning-header">
        <div className="container">
          <div className="header-content">
            <button onClick={() => navigate('/event-planner')} className="back-btn">
              <FaArrowLeft /> Back to Planner
            </button>
            <div className="header-title">
              <h1>2D Floor Planning</h1>
              <p>{venue.name} - {venue.dimensions.width}m × {venue.dimensions.length}m</p>
            </div>
            <div className="header-actions">
              <button className="action-btn" onClick={savePlan}>
                <FaSave /> Save Plan
              </button>
              <button className="action-btn" onClick={exportPlan}>
                <FaDownload /> Export
              </button>
              <button className="action-btn" onClick={() => setZoom(1)}>
                <FaExpand /> Reset Zoom
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="planning-workspace">
        {/* Tools Panel */}
        <div className="tools-panel">
          <div className="panel-section">
            <h3>Floor Plan Tools</h3>
            <div className="tools-grid">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
                  onClick={() => setActiveTool(tool.id)}
                >
                  <tool.icon style={{ color: tool.color }} />
                  <span>{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          {activeTool === 'furniture' && (
            <div className="panel-section">
              <h3>Venue Equipment</h3>
              <div className="furniture-grid">
                {furnitureItems.map(item => (
                  <button
                    key={item.id}
                    className="furniture-btn"
                    onClick={() => {
                      const newObj = {
                        id: Date.now(),
                        type: 'furniture',
                        x: 100,
                        y: 100,
                        width: item.width,
                        depth: item.depth,
                        color: item.color,
                        label: item.name,
                        furnitureType: item.type
                      };
                      addObject(newObj);
                    }}
                  >
                    <item.icon style={{ color: item.color }} />
                    <div className="furniture-info">
                      <span>{item.name}</span>
                      <small>{item.width}m × {item.depth}m</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'wall' && (
            <div className="panel-section">
              <h3>Wall Settings</h3>
              <div className="control-group">
                <label>Wall Thickness:</label>
                <div className="thickness-controls">
                  <button 
                    onClick={() => setWallThickness(prev => Math.max(0.1, prev - 0.05))}
                    disabled={wallThickness <= 0.1}
                  >
                    <FaMinus />
                  </button>
                  <span>{wallThickness.toFixed(2)}m</span>
                  <button 
                    onClick={() => setWallThickness(prev => prev + 0.05)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="active-tool-info">
                <p><strong>Click and drag to draw walls</strong></p>
                <p className="placement-hint">
                  Click to start, drag to set length and direction, release to place
                </p>
              </div>
            </div>
          )}

          <div className="panel-section">
            <h3>View Controls</h3>
            <div className="control-buttons">
              <button 
                className={`control-btn ${gridVisible ? 'active' : ''}`}
                onClick={() => setGridVisible(!gridVisible)}
              >
                {gridVisible ? <FaEye /> : <FaEyeSlash />}
                Grid {gridVisible ? 'On' : 'Off'}
              </button>
              <button 
                className={`control-btn ${snapToGrid ? 'active' : ''}`}
                onClick={() => setSnapToGrid(!snapToGrid)}
              >
                <FaObjectGroup />
                Snap {snapToGrid ? 'On' : 'Off'}
              </button>
              <div className="zoom-controls">
                <button onClick={() => setZoom(prev => Math.min(prev + 0.1, 5))}>
                  <FaPlus />
                </button>
                <span>{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.1))}>
                  <FaMinus />
                </button>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h3>Active Tool</h3>
            <div className="active-tool-info">
              <p><strong>{tools.find(t => t.id === activeTool)?.name}</strong></p>
              {activeTool === 'wall' ? (
                <p className="placement-hint">
                  Click and drag to draw walls
                </p>
              ) : activeTool === 'select' ? (
                <p className="placement-hint">
                  Click to select • Drag to move • Arrow keys to nudge
                </p>
              ) : activeTool === 'measure' ? (
                <p className="placement-hint">
                  Click and drag to measure
                </p>
              ) : (
                <p className="placement-hint">
                  Click to place object
                </p>
              )}
            </div>
          </div>

          {selectedObject && (
            <div className="panel-section">
              <h3>Selected Object</h3>
              <div className="selected-object-info">
                <p><strong>{selectedObject.type}</strong></p>
                <p>Use Arrow Keys to move</p>
                <p>Press Delete to remove</p>
                <p>Press Escape to deselect</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Canvas */}
        <div className="canvas-container">
          <div className="canvas-controls">
            <div className="view-info">
              <span>Zoom: {Math.round(zoom * 100)}%</span>
              <span>Scale: 1:{scale}</span>
              <span>Objects: {objects.length}</span>
            </div>
            <div className="canvas-actions">
              {selectedObject && (
                <button className="delete-btn" onClick={deleteSelectedObject}>
                  <FaTrash /> Delete
                </button>
              )}
              <button className="action-btn" onClick={() => setObjects([])}>
                <FaEraser /> Clear All
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="floorplan-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
          
          <div className="canvas-hint">
            {activeTool === 'wall' ? (
              <p>
                🖱️ <strong>Click and drag to draw walls</strong> • 
                📏 <strong>Thickness: {wallThickness}m</strong>
              </p>
            ) : (
              <p>
                🖱️ Click to place objects • 🔄 Scroll to zoom • 🖱️ Middle click to pan •
                ⌨️ Use arrow keys to move selected objects
              </p>
            )}
            {selectedObject && (
              <p className="selection-hint">
                <strong>Selected: {selectedObject.type} • Use Arrow Keys to move • Delete to remove</strong>
              </p>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="properties-panel">
          <div className="panel-section">
            <h3>Venue Properties</h3>
            <div className="property-group">
              <div className="property">
                <label>Venue:</label>
                <span>{venue.name}</span>
              </div>
              <div className="property">
                <label>Dimensions:</label>
                <span>{venue.dimensions.width}m × {venue.dimensions.length}m</span>
              </div>
              <div className="property">
                <label>Total Area:</label>
                <span>{(venue.dimensions.width * venue.dimensions.length).toFixed(0)}m²</span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h3>Selected Object</h3>
            {selectedObject ? (
              <div className="selected-object-info">
                <div className="property">
                  <label>Type:</label>
                  <span>{selectedObject.type}</span>
                </div>
                <div className="property">
                  <label>Position:</label>
                  <span>
                    X: {(selectedObject.x / scale).toFixed(1)}m, 
                    Y: {(selectedObject.y / scale).toFixed(1)}m
                  </span>
                </div>
                <div className="property">
                  <label>Size:</label>
                  <span>{selectedObject.width}m × {selectedObject.depth}m</span>
                </div>
                <div className="property">
                  <label>Area:</label>
                  <span>{(selectedObject.width * selectedObject.depth).toFixed(1)}m²</span>
                </div>
                {selectedObject.label && (
                  <div className="property">
                    <label>Label:</label>
                    <span>{selectedObject.label}</span>
                  </div>
                )}
                {selectedObject.exhibitorId && (
                  <>
                    <div className="property">
                      <label>Exhibitor:</label>
                      <span>
                        {exhibitorDatabase.find(e => e.id === selectedObject.exhibitorId)?.company}
                      </span>
                    </div>
                    <button 
                      className="info-btn"
                      onClick={() => {
                        const exhibitor = exhibitorDatabase.find(e => e.id === selectedObject.exhibitorId);
                        setCurrentExhibitor(exhibitor);
                        setShowExhibitorModal(true);
                      }}
                    >
                      <FaInfoCircle /> View Exhibitor Details
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="no-selection">No object selected</p>
            )}
          </div>

          <div className="panel-section">
            <h3>Event Statistics</h3>
            <div className="stats-overview">
              <div className="stat-item">
                <FaBuilding />
                <span>{objects.filter(obj => obj.type === 'stand').length} Exhibition Stands</span>
              </div>
              <div className="stat-item">
                <FaUsers />
                <span>{exhibitorDatabase.length} Registered Exhibitors</span>
              </div>
              <div className="stat-item">
                <FaVectorSquare />
                <span>Used Area: {
                  objects.reduce((total, obj) => total + (obj.width * obj.depth), 0).toFixed(1)
                }m²</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stand Configuration Modal */}
      {showStandConfig && (
        <div className="modal-overlay">
          <div className="exhibitor-modal">
            <div className="modal-header">
              <h2>Configure Exhibition Stand</h2>
              <button 
                className="close-btn"
                onClick={() => setShowStandConfig(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="config-section">
                <h4>Stand Dimensions</h4>
                <div className="dimension-inputs">
                  <div className="input-group">
                    <label>Width (m):</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={standConfig.width}
                      onChange={(e) => setStandConfig(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Depth (m):</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={standConfig.depth}
                      onChange={(e) => setStandConfig(prev => ({ ...prev, depth: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="config-section">
                <h4>Stand Information</h4>
                <div className="input-group">
                  <label>Company/Stand Name:</label>
                  <input
                    type="text"
                    placeholder="Enter company or stand name"
                    value={standConfig.name}
                    onChange={(e) => setStandConfig(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>

              <div className="stand-preview">
                <h4>Stand Preview</h4>
                <div className="preview-box">
                  <div className="preview-dimensions">
                    {standConfig.width}m × {standConfig.depth}m
                  </div>
                  <div className="preview-area">
                    Area: {(standConfig.width * standConfig.depth).toFixed(1)}m²
                  </div>
                  {standConfig.name && (
                    <div className="preview-name">
                      Label: {standConfig.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowStandConfig(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={confirmStandPlacement}
              >
                <FaBuilding /> Place Stand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exhibitor Detail Modal */}
      {showExhibitorModal && currentExhibitor && (
        <div className="modal-overlay">
          <div className="exhibitor-modal">
            <div className="modal-header">
              <h2>Exhibitor Details</h2>
              <button 
                className="close-btn"
                onClick={() => setShowExhibitorModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="exhibitor-header">
                <div 
                  className="company-logo-large"
                  style={{ backgroundColor: currentExhibitor.color }}
                >
                  {currentExhibitor.logo}
                </div>
                <div>
                  <h3>{currentExhibitor.company}</h3>
                  <span className="industry-badge">{currentExhibitor.industry}</span>
                </div>
              </div>
              
              <div className="exhibitor-details">
                <div className="detail-section">
                  <h4>About</h4>
                  <p>{currentExhibitor.description}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Products & Services</h4>
                  <div className="products-list">
                    {currentExhibitor.products.map((product, index) => (
                      <span key={index} className="product-tag">{product}</span>
                    ))}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Contact Information</h4>
                  <div className="contact-info">
                    <p><FaUsers /> {currentExhibitor.contact}</p>
                    <p><FaBuilding /> {currentExhibitor.website}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowExhibitorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venue2D;