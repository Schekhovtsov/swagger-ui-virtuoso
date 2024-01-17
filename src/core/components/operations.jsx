import React from "react"
import PropTypes from "prop-types"
import Im from "immutable"
import {Virtuoso} from "react-virtuoso"

export default class Operations extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    oas3Selectors: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
    fn: PropTypes.func.isRequired
  }

  render() {
    let {
      specSelectors,
      getComponent,
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
    } = this.props

    const taggedOps = specSelectors.taggedOperations()
    const itemsInArray = Array.from(taggedOps.entries())
    const validOperationMethods = specSelectors.validOperationMethods()
    const OperationContainer = getComponent("OperationContainer", true)

    if(taggedOps.size === 0) {
      return <h3> No operations defined in spec!</h3>
    }

    return (
      <div>
        <Virtuoso
          style={{ height: "500px" }}
          totalCount={taggedOps?.size}
          data={itemsInArray}
          // eslint-disable-next-line react/jsx-no-bind
          itemContent={(index) => {
            const tag = itemsInArray[index][0]
            const tagObj = itemsInArray[index][1]
            const OperationTag = getComponent("OperationTag")
            const operations = tagObj.get("operations")

            return <OperationTag
              key={"operation-" + tag}
              tagObj={tagObj}
              tag={tag}
              oas3Selectors={oas3Selectors}
              layoutSelectors={layoutSelectors}
              layoutActions={layoutActions}
              getConfigs={getConfigs}
              getComponent={getComponent}
              specUrl={specSelectors.url()}>
              <div className="operation-tag-content">
                {
                  operations.map(op => {
                    const path = op.get("path")
                    const method = op.get("method")
                    const specPath = Im.List(["paths", path, method])

                    if (validOperationMethods.indexOf(method) === -1) {
                      return null
                    }

                    return (
                      <OperationContainer
                        key={`${path}-${method}`}
                        specPath={specPath}
                        op={op}
                        path={path}
                        method={method}
                        tag={tag} />
                    )
                  }).toArray()
                }
              </div>
            </OperationTag>

          }}
        />
        { taggedOps.size < 1 ? <h3> No operations defined in spec! </h3> : null }
      </div>
    )
  }
}

Operations.propTypes = {
  layoutActions: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired
}
