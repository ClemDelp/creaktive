/*jslint forin: true, nomen: true*/
/*global _, MAPJS, observable*/
MAPJS.MapModel = function (mapRepository, layoutCalculator, titlesToRandomlyChooseFrom, intermediaryTitlesToRandomlyChooseFrom) {
	'use strict';
	titlesToRandomlyChooseFrom = titlesToRandomlyChooseFrom || ['double click to edit'];
	intermediaryTitlesToRandomlyChooseFrom = intermediaryTitlesToRandomlyChooseFrom || titlesToRandomlyChooseFrom;
	var self = this,
		analytic,
		currentLayout = {
			nodes: {},
			connectors: {}
		},
		idea,
		isInputEnabled = true,
		currentlySelectedIdeaId,

		getRandomTitle = function (titles) {
			return titles[Math.floor(titles.length * Math.random())];
		},
		horizontalSelectionThreshold = 300,
		moveNodes = function (nodes, deltaX, deltaY) {
			_.each(nodes, function (node) {
				node.x += deltaX;
				node.y += deltaY;
			});
		},
		updateCurrentLayout = function (newLayout, contextNodeId) {
			var nodeId, newNode, oldNode, newConnector, oldConnector;
			if (contextNodeId && currentLayout.nodes[contextNodeId] && newLayout.nodes[contextNodeId]) {
				moveNodes(newLayout.nodes,
					currentLayout.nodes[contextNodeId].x - newLayout.nodes[contextNodeId].x,
					currentLayout.nodes[contextNodeId].y - newLayout.nodes[contextNodeId].y
					);
			}
			for (nodeId in currentLayout.connectors) {
				newConnector = newLayout.connectors[nodeId];
				oldConnector = currentLayout.connectors[nodeId];
				if (!newConnector || newConnector.from !== oldConnector.from || newConnector.to !== oldConnector.to) {
					self.dispatchEvent('connectorRemoved', oldConnector);
				}
			}
			for (nodeId in currentLayout.nodes) {
				nodeId = nodeId;
				oldNode = currentLayout.nodes[nodeId];
				newNode = newLayout.nodes[nodeId];
				if (!newNode) {
					if (nodeId === currentlySelectedIdeaId) {
						self.selectNode(idea.id);
					}
					self.dispatchEvent('nodeRemoved', oldNode);
				}
			}
			for (nodeId in newLayout.nodes) {
				oldNode = currentLayout.nodes[nodeId];
				newNode = newLayout.nodes[nodeId];
				if (!oldNode) {
					self.dispatchEvent('nodeCreated', newNode);
				} else {
					if (newNode.x !== oldNode.x || newNode.y !== oldNode.y) {
						self.dispatchEvent('nodeMoved', newNode);
					}
					if (newNode.title !== oldNode.title) {
						self.dispatchEvent('nodeTitleChanged', newNode);
					}
					if (!_.isEqual(newNode.attr || {}, oldNode.attr || {})) {
						self.dispatchEvent('nodeAttrChanged', newNode);
					}
				}
			}
			for (nodeId in newLayout.connectors) {
				newConnector = newLayout.connectors[nodeId];
				oldConnector = currentLayout.connectors[nodeId];
				if (!oldConnector || newConnector.from !== oldConnector.from || newConnector.to !== oldConnector.to) {
					self.dispatchEvent('connectorCreated', newConnector);
				}
			}
			currentLayout = newLayout;
		},
		onIdeaChanged = function (command, args) {
			var newIdeaId, contextNodeId;
			contextNodeId = command === 'updateAttr' ? args[0] : undefined;
			updateCurrentLayout(layoutCalculator(idea), contextNodeId);
			if (command === 'addSubIdea') {
				newIdeaId = args[2];
				self.selectNode(newIdeaId);
				self.editNode(false, true, true);
			}
			if (command === 'insertIntermediate') {
				newIdeaId = args[2];
				self.selectNode(newIdeaId);
				self.editNode(false, true, true);
			}
			if (command === 'paste') {
				newIdeaId = args[2];
				self.selectNode(newIdeaId);
			}

		},
		currentlySelectedIdea = function () {
			return (idea.findSubIdeaById(currentlySelectedIdeaId) || idea);
		},
		ensureNodeIsExpanded = function (source, nodeId) {
			var node = idea.findSubIdeaById(nodeId) || idea;
			if (node.getAttr('collapsed')) {
				idea.updateAttr(nodeId, 'collapsed', false);
			}
		};
	observable(this);
	analytic = self.dispatchEvent.bind(self, 'analytic', 'mapModel');
	this.setIdea = function (anIdea) {
		if (idea) {
			idea.removeEventListener('changed', onIdeaChanged);
			self.dispatchEvent('nodeSelectionChanged', currentlySelectedIdeaId, false);
			currentlySelectedIdeaId = undefined;
		}
		idea = anIdea;
		idea.addEventListener('changed', onIdeaChanged);
		onIdeaChanged();
		self.selectNode(idea.id);
		self.dispatchEvent('mapViewResetRequested');
	};
	mapRepository.addEventListener('mapLoaded', this.setIdea);
	this.setInputEnabled = function (value) {
		if (isInputEnabled !== value) {
			isInputEnabled = value;
			self.dispatchEvent('inputEnabledChanged', value);
		}
	};
	this.getInputEnabled = function () {
		return isInputEnabled;
	};
	this.selectNode = function (id) {
		if (isInputEnabled && id !== currentlySelectedIdeaId) {
			if (currentlySelectedIdeaId) {
				self.dispatchEvent('nodeSelectionChanged', currentlySelectedIdeaId, false);
			}
			currentlySelectedIdeaId = id;
			self.dispatchEvent('nodeSelectionChanged', id, true);
		}
	};
	this.getSelectedStyle = function (prop) {
		var node = currentLayout.nodes[currentlySelectedIdeaId];
		return node && node.attr && node.attr.style && node.attr.style[prop];
	};
	this.toggleCollapse = function (source) {
		var isCollapsed = currentlySelectedIdea().getAttr('collapsed');
		this.collapse(source, !isCollapsed);
	};
	this.collapse = function (source, doCollapse) {
		analytic('collapse:' + doCollapse, source);
		if (isInputEnabled) {
			var node = currentlySelectedIdea();
			if (node.ideas && _.size(node.ideas) > 0) {
				idea.updateAttr(currentlySelectedIdeaId, 'collapsed', doCollapse);
			}
		}
	};
	this.updateStyle = function (source, prop, value) {
		/*jslint eqeq:true */
		if (isInputEnabled && this.getSelectedStyle(prop) != value) {
			analytic('updateStyle:' + prop, source);
			var merged = _.extend({}, currentlySelectedIdea().getAttr('style'));
			merged[prop] = value;
			idea.updateAttr(currentlySelectedIdeaId, 'style', merged);
		}
	};
	this.addSubIdea = function (source, parentId) {
		var target = parentId || currentlySelectedIdeaId;
		analytic('addSubIdea', source);
		if (isInputEnabled) {
			ensureNodeIsExpanded(source, target);
			idea.addSubIdea(target, getRandomTitle(titlesToRandomlyChooseFrom));
		}
	};
	this.createFromDB = function (parentId, node) {
		if(!parentId || !node){
			return ;
		};
		analytic("createFromDB", "DB");
		idea.createFromDB(parentId, node);
	}
	this.insertIntermediate = function (source) {
		if (!isInputEnabled || currentlySelectedIdeaId === idea.id) {
			return;
		}
		idea.insertIntermediate(currentlySelectedIdeaId, getRandomTitle(intermediaryTitlesToRandomlyChooseFrom));
		analytic('insertIntermediate', source);
	};
	this.addSiblingIdea = function (source) {
		analytic('addSiblingIdea', source);
		if (isInputEnabled) {
			var parent = idea.findParent(currentlySelectedIdeaId) || idea;
			ensureNodeIsExpanded(source, parent.id);
			idea.addSubIdea(parent.id, getRandomTitle(titlesToRandomlyChooseFrom));
		}
	};
	this.removeSubIdea = function (source, targetId) {
		analytic('removeSubIdea', source);
		if (isInputEnabled) {
			var target = targetId || currentlySelectedIdeaId,
				parent = idea.findParent(target);
			if (idea.removeSubIdea(target)) {
				self.selectNode(parent.id);
			}
		}
	};
	this.updateTitle = function (ideaId, title) {
		idea.updateTitle(ideaId, title);
	};
	this.editNode = function (source, shouldSelectAll, editingNew) {
		if (source) {
			analytic('editNode', source);
		}
		if (!isInputEnabled) {
			return false;
		}
		var title = currentlySelectedIdea().title;
		if (intermediaryTitlesToRandomlyChooseFrom.indexOf(title) !== -1 ||
				 titlesToRandomlyChooseFrom.indexOf(title) !== -1) {
			shouldSelectAll = true;
		}
		self.dispatchEvent('nodeEditRequested', currentlySelectedIdeaId, shouldSelectAll, !!editingNew);
	};
	this.scaleUp = function (source) {
		self.scale(source, 1.25);
	};
	this.scaleDown = function (source) {
		self.scale(source, 0.8);
	};
	this.scale = function (source, scaleMultiplier, zoomPoint) {
		if (isInputEnabled) {
			self.dispatchEvent('mapScaleChanged', scaleMultiplier, zoomPoint);
			analytic(scaleMultiplier < 1 ? 'scaleDown' : 'scaleUp', source);
		}
	};
	this.move = function (source, deltaX, deltaY) {
		if (isInputEnabled) {
			self.dispatchEvent('mapMoveRequested', deltaX, deltaY);
			analytic('move', source);
		}
	};
	this.resetView = function (source) {
		if (isInputEnabled) {
			self.dispatchEvent('mapViewResetRequested');
			analytic('resetView', source);
		}
	};
	this.openDetails = function(nodeId){
		self.dispatchEvent('openDetails', nodeId);
	};
	this.openAttachment = function (source, nodeId) {
		analytic('openAttachment', source);
		nodeId = nodeId || currentlySelectedIdeaId;
		var node = currentLayout.nodes[nodeId],
			attachment = node && node.attr && node.attr.attachment;
		if (node) {
			self.dispatchEvent('attachmentOpened', nodeId, attachment);
		}
	};
	this.setAttachment = function (source, nodeId, attachment) {
		analytic('setAttachment', source);
		var hasAttachment = !!(attachment && attachment.content);
		idea.updateAttr(nodeId, 'attachment', hasAttachment && attachment);
	};
	(function () {
		var isRootOrRightHalf = function (id) {
				return currentLayout.nodes[id].x >= currentLayout.nodes[idea.id].x;
			},
			isRootOrLeftHalf = function (id) {
				return currentLayout.nodes[id].x <= currentLayout.nodes[idea.id].x;
			},
			nodesWithIDs = function () {
				return _.map(currentLayout.nodes,
					function (n, nodeId) {
						return _.extend({ id: parseInt(nodeId, 10)}, n);
					});
			};
		self.selectNodeLeft = function (source) {
			var node,
				rank,
				isRoot = currentlySelectedIdeaId === idea.id,
				targetRank = isRoot ? -Infinity : Infinity;
			if (!isInputEnabled) {
				return;
			}
			analytic('selectNodeLeft', source);
			if (isRootOrLeftHalf(currentlySelectedIdeaId)) {
				node = idea.id === currentlySelectedIdeaId ? idea : idea.findSubIdeaById(currentlySelectedIdeaId);
				ensureNodeIsExpanded(source, node.id);
				for (rank in node.ideas) {
					rank = rank;
					if ((isRoot && rank < 0 && rank > targetRank) || (!isRoot && rank > 0 && rank < targetRank)) {
						targetRank = rank;
					}
				}
				if (targetRank !== Infinity && targetRank !== -Infinity) {
					self.selectNode(node.ideas[targetRank].id);
				}
			} else {
				self.selectNode(idea.findParent(currentlySelectedIdeaId).id);
			}
		};
		self.selectNodeRight = function (source) {
			var node, rank, minimumPositiveRank = Infinity;
			if (!isInputEnabled) {
				return;
			}
			analytic('selectNodeRight', source);
			if (isRootOrRightHalf(currentlySelectedIdeaId)) {
				node = idea.id === currentlySelectedIdeaId ? idea : idea.findSubIdeaById(currentlySelectedIdeaId);
				ensureNodeIsExpanded(source, node.id);
				for (rank in node.ideas) {
					rank = rank;
					if (rank > 0 && rank < minimumPositiveRank) {
						minimumPositiveRank = rank;
					}
				}
				if (minimumPositiveRank !== Infinity) {
					self.selectNode(node.ideas[minimumPositiveRank].id);
				}
			} else {
				self.selectNode(idea.findParent(currentlySelectedIdeaId).id);
			}
		};

		self.selectNodeUp = function (source) {
			var previousSibling = idea.previousSiblingId(currentlySelectedIdeaId),
				nodesAbove,
				closestNode,
				currentNode = currentLayout.nodes[currentlySelectedIdeaId];
			if (!isInputEnabled) {
				return;
			}
			analytic('selectNodeUp', source);
			if (previousSibling) {
				self.selectNode(previousSibling);
			} else {
				if (!currentNode) { return; }
				nodesAbove = _.reject(nodesWithIDs(), function (node) {
					return node.y >= currentNode.y || Math.abs(node.x - currentNode.x) > horizontalSelectionThreshold;
				});
				if (_.size(nodesAbove) === 0) {
					return;
				}
				closestNode = _.min(nodesAbove, function (node) {
					return Math.pow(node.x - currentNode.x, 2) + Math.pow(node.y - currentNode.y, 2);
				});
				self.selectNode(closestNode.id);
			}
		};
		self.selectNodeDown = function (source) {
			var nextSibling = idea.nextSiblingId(currentlySelectedIdeaId),
				nodesBelow,
				closestNode,
				currentNode = currentLayout.nodes[currentlySelectedIdeaId];
			if (!isInputEnabled) {
				return;
			}
			analytic('selectNodeDown', source);
			if (nextSibling) {
				self.selectNode(nextSibling);
			} else {
				if (!currentNode) { return; }
				nodesBelow = _.reject(nodesWithIDs(), function (node) {
					return node.y <= currentNode.y || Math.abs(node.x - currentNode.x) > horizontalSelectionThreshold;
				});
				if (_.size(nodesBelow) === 0) {
					return;
				}
				closestNode = _.min(nodesBelow, function (node) {
					return Math.pow(node.x - currentNode.x, 2) + Math.pow(node.y - currentNode.y, 2);
				});
				self.selectNode(closestNode.id);
			}
		};
		self.undo = function (source) {
			analytic('undo', source);
			if (isInputEnabled) {
				idea.undo();
			}
		};
		self.redo = function (source) {
			analytic('redo', source);
			if (isInputEnabled) {
				idea.redo();
			}
		};
		self.moveRelative = function (source, relativeMovement) {
			analytic('moveRelative', source);
			if (isInputEnabled) {
				idea.moveRelative(currentlySelectedIdeaId, relativeMovement);
			}
		};
		self.cut = function (source) {
			analytic('cut', source);
			if (isInputEnabled) {
				self.clipBoard = idea.clone(currentlySelectedIdeaId);
				var parent = idea.findParent(currentlySelectedIdeaId);
				if (idea.removeSubIdea(currentlySelectedIdeaId)) {
					self.selectNode(parent.id);
				}
			}
		};
		self.copy = function (source) {
			analytic('copy', source);
			if (isInputEnabled) {
				self.clipBoard = idea.clone(currentlySelectedIdeaId);
			}
		};
		self.paste = function (source) {
			analytic('paste', source);
			if (isInputEnabled) {
				idea.paste(currentlySelectedIdeaId, self.clipBoard);
			}
		};
		self.pasteStyle = function (source) {
			analytic('pasteStyle', source);
			if (isInputEnabled && self.clipBoard) {
				var pastingStyle = self.clipBoard.attr && self.clipBoard.attr.style;
				idea.updateAttr(currentlySelectedIdeaId, 'style', pastingStyle);
			}
		};
		self.moveUp = function (source) { self.moveRelative(source, -1); };
		self.moveDown = function (source) { self.moveRelative(source, 1); };
	}());
	//Todo - clean up this shit below
	(function () {
		var currentDroppable,
			updateCurrentDroppable = function (value) {
				if (currentDroppable !== value) {
					if (currentDroppable) {
						self.dispatchEvent('nodeDroppableChanged', currentDroppable, false);
					}
					currentDroppable = value;
					if (currentDroppable) {
						self.dispatchEvent('nodeDroppableChanged', currentDroppable, true);
					}
				}
			},
			canDropOnNode = function (id, x, y, node) {
				return id !== node.id &&
					x >= node.x &&
					y >= node.y &&
					x <= node.x + node.width - 2 * 10 &&
					y <= node.y + node.height - 2 * 10;
			},
			tryFlip = function (rootNode, nodeBeingDragged, nodeDragEndX) {
				var flipRightToLeft = rootNode.x < nodeBeingDragged.x && nodeDragEndX < rootNode.x,
					flipLeftToRight = rootNode.x > nodeBeingDragged.x && rootNode.x < nodeDragEndX;
				if (flipRightToLeft || flipLeftToRight) {
					return idea.flip(nodeBeingDragged.id);
				}
				return false;
			};
		self.nodeDragMove = function (id, x, y) {
			var nodeId, node;
			for (nodeId in currentLayout.nodes) {
				nodeId = nodeId;
				node = currentLayout.nodes[nodeId];
				if (canDropOnNode(id, x, y, node)) {
					updateCurrentDroppable(nodeId);
					return;
				}
			}
			updateCurrentDroppable(undefined);
		};
		self.nodeDragEnd = function (id, x, y, shouldCopy) {
			var nodeBeingDragged = currentLayout.nodes[id],
				nodeId,
				node,
				rootNode = currentLayout.nodes[idea.id],
				verticallyClosestNode = { id: null, y: Infinity },
				clone;
			updateCurrentDroppable(undefined);
			self.dispatchEvent('nodeMoved', nodeBeingDragged);
			for (nodeId in currentLayout.nodes) {
				node = currentLayout.nodes[nodeId];
				if (canDropOnNode(id, x, y, node)) {
					if (shouldCopy) {
						clone = idea.clone(id);
						if (!clone || !idea.paste(nodeId, clone)) {
							self.dispatchEvent('nodeMoved', nodeBeingDragged, 'failed');
						}
					} else if (!idea.changeParent(id, nodeId)) {
						self.dispatchEvent('nodeMoved', nodeBeingDragged, 'failed');
					}
					return;
				}
				if ((nodeBeingDragged.x === node.x || nodeBeingDragged.x + nodeBeingDragged.width === node.x + node.width) && y < node.y) {
					if (!verticallyClosestNode || node.y < verticallyClosestNode.y) {
						verticallyClosestNode = node;
					}
				}
			}
			if (tryFlip(rootNode, nodeBeingDragged, x)) {
				return;
			}
			if (idea.positionBefore(id, verticallyClosestNode.id)) {
				return;
			}
			self.dispatchEvent('nodeMoved', nodeBeingDragged, 'failed');
		};
	}());
};
